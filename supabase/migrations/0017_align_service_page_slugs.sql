-- Keep existing CMS services aligned with the public service URLs.
-- Each rename is skipped if a record already uses the canonical slug.
UPDATE public.services AS legacy
SET slug = 'mobile-development'
WHERE legacy.slug = 'mobile-apps'
  AND NOT EXISTS (
    SELECT 1 FROM public.services AS canonical WHERE canonical.slug = 'mobile-development'
  );

UPDATE public.services AS legacy
SET slug = 'ui-ux-design'
WHERE legacy.slug = 'design'
  AND NOT EXISTS (
    SELECT 1 FROM public.services AS canonical WHERE canonical.slug = 'ui-ux-design'
  );

UPDATE public.services AS legacy
SET slug = 'api-development'
WHERE legacy.slug = 'api-integration'
  AND NOT EXISTS (
    SELECT 1 FROM public.services AS canonical WHERE canonical.slug = 'api-development'
  );

UPDATE public.services AS legacy
SET slug = 'saas-development'
WHERE legacy.slug = 'saas'
  AND NOT EXISTS (
    SELECT 1 FROM public.services AS canonical WHERE canonical.slug = 'saas-development'
  );

INSERT INTO public.services (
  title,
  slug,
  overview,
  benefits,
  process,
  pricing_approach,
  display_order,
  is_active
)
VALUES (
  'Maintenance & Support',
  'maintenance-support',
  'Practical ongoing support for websites and software that need dependable updates, fixes, and improvement.',
  ARRAY[
    'Bug fixes and priority issue support',
    'Security and dependency updates',
    'Performance monitoring and optimisation',
    'Feature enhancements and backlog planning'
  ],
  ARRAY['Assess and prioritise', 'Stabilise and maintain', 'Improve continuously'],
  'Support is scoped around the product, response needs, and expected delivery rhythm.',
  6,
  true
)
ON CONFLICT (slug) DO NOTHING;
