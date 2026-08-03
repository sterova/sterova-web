import { SITE } from "@/data/constants";
import { CheckCircle2, AlertCircle } from "lucide-react";

const FEATURES = [
  "Semantic HTML5 elements throughout the site",
  "ARIA labels and roles on interactive components",
  "Keyboard navigation for all menus and modals",
  "Focus management with visible focus indicators",
  "Sufficient color contrast ratios (WCAG AA)",
  "Alt text on all meaningful images",
  "Responsive layout for all screen sizes",
  "No content that flashes more than three times per second",
  "Skip-to-content link available on all pages",
  "Form labels associated with their inputs",
];

const KNOWN_ISSUES = [
  "Some third-party embedded content may not meet full WCAG 2.1 AA compliance.",
  "PDF documents linked from the site may not be fully accessible — we are working on remediation.",
];

export default function AccessibilityPage() {
  return (
    <>
      <section className="pt-36 pb-24">
        <div className="container-custom max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Accessibility Statement
          </h1>
          <p className="text-muted-foreground mb-12">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-invert prose-headings:font-display max-w-none">
            <section>
              <h2>Our Commitment</h2>
              <p>
                {SITE.name} is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
              </p>
              <p>
                We aim to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> across this website.
              </p>
            </section>
          </div>

          {/* What we've implemented */}
          <div className="mt-10 mb-10">
            <h2 className="font-display font-bold text-xl mb-5">What We've Implemented</h2>
            <div className="flex flex-col gap-3">
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Known issues */}
          <div className="mb-10">
            <h2 className="font-display font-bold text-xl mb-5">Known Limitations</h2>
            <div className="flex flex-col gap-3">
              {KNOWN_ISSUES.map((issue) => (
                <div key={issue} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="prose prose-invert prose-headings:font-display max-w-none">
            <section>
              <h2>Technical Approach</h2>
              <p>
                This website is built with semantic HTML5, Tailwind CSS, and React 19. Interactive components use Radix UI primitives, which implement WAI-ARIA design patterns for accessible disclosure widgets, dialogs, menus, and form controls.
              </p>
            </section>

            <section>
              <h2>Browser and Assistive Technology Compatibility</h2>
              <p>
                We test on modern browsers (Chrome, Firefox, Safari, Edge) and aim for compatibility with common screen readers including NVDA (Windows), JAWS (Windows), and VoiceOver (macOS/iOS).
              </p>
            </section>

            <section>
              <h2>Feedback and Contact</h2>
              <p>
                We welcome accessibility feedback. If you encounter any barriers while using our website, or if you need information in an alternative format, please contact us:
              </p>
              <ul>
                <li>Email: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                <li>Response time: within 5 business days</li>
              </ul>
              <p>
                We take accessibility concerns seriously and will work to address reported issues promptly.
              </p>
            </section>

            <section>
              <h2>Formal Complaints</h2>
              <p>
                If you are not satisfied with our response to your accessibility concern, you may contact the relevant national equality or disability rights body in your jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
