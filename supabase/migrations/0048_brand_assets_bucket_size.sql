-- Set explicit 15 MB per-file limit on brand-assets bucket.
-- Previously relied on Supabase's project-global default (50 MB).
update storage.buckets
set file_size_limit = 15728640  -- 15 MB
where id = 'brand-assets';
