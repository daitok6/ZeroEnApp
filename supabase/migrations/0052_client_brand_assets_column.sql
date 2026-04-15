-- 0051_client_brand_assets_column.sql
-- Add assets jsonb column to client_brand for Step 5 of the design wizard.
-- Each element: { path: text, caption: text, content_type: text, size: integer }
-- Maximum 3 assets enforced at DB level.

alter table public.client_brand
  add column if not exists assets jsonb not null default '[]'::jsonb;

alter table public.client_brand
  add constraint client_brand_assets_max_3
  check (jsonb_typeof(assets) = 'array' and jsonb_array_length(assets) <= 3);
