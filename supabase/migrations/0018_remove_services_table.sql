-- Destructive: permanently removes all service records and the services table.
-- The public site now reads services only from src/data/constants.ts and
-- src/data/service-pages.ts, so this table is no longer needed.
--
-- Apply this migration only after exporting any service data you may need.
DROP TABLE IF EXISTS public.services CASCADE;
