/**
 * Thin compatibility layer so page/section components can keep using a simple
 * `href` based Link API while navigation is actually handled by TanStack
 * Router. It also transparently handles hash links, external links and
 * `mailto:` / `tel:` links.
 */
import * as React from "react";
import { Link as RouterLink, useRouterState, useParams, useNavigate } from "@tanstack/react-router";
import { useCancelStaleNavigation } from "@/lib/navigation";
import { withSmoothAnchorScroll } from "@/lib/scroll";

const AnyRouterLink = RouterLink as unknown as React.ComponentType<Record<string, unknown>>;

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
}

function isExternal(href: string) {
  return (
    /^https?:\/\//.test(href) ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#")
  );
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, onClick, ...rest }, ref) => {
    const cancelStale = useCancelStaleNavigation();

    if (isExternal(href)) {
      return (
        <a
          ref={ref}
          href={href}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
            // In-page anchors are the only place smooth scrolling is wanted.
            if (href.startsWith("#")) withSmoothAnchorScroll();
            onClick?.(event);
          }}
          {...rest}
        >
          {children}
        </a>
      );
    }

    const [beforeHash, hash] = href.split("#");
    const [pathname, queryString] = beforeHash.split("?");
    const search = queryString
      ? Object.fromEntries(new URLSearchParams(queryString).entries())
      : undefined;

    return (
      <AnyRouterLink
        ref={ref}
        to={pathname || "/"}
        search={search}
        hash={hash || undefined}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          // Abort a still-resolving previous destination so the newest click wins.
          cancelStale(pathname || "/");
          if (hash) withSmoothAnchorScroll();
          onClick?.(event);
        }}
        {...rest}
      >
        {children}
      </AnyRouterLink>
    );
  },
);
Link.displayName = "Link";

/** `[pathname, navigate]` — mirrors the previous router's signature. */
export function useLocation(): [string, (to: string) => void] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  return [pathname, (to: string) => void navigate({ to })];
}

/** `[matched, params]` for a single dynamic segment pattern. */
export function useRoute(pattern: string): [boolean, Record<string, string> | null] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const params = useParams({ strict: false }) as Record<string, string>;
  const base = pattern.split("/:")[0];
  const matched = pathname.startsWith(base);
  return [matched, matched ? params : null];
}
