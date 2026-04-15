-- 0047_brand_assets_bucket.sql
-- Create the brand-assets storage bucket for client logo/image uploads.
-- Bucket is private; RLS policies enforce per-user path isolation.

insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', false);

-- Allow authenticated users to upload files into their own path prefix (uid/...)
create policy "Users can upload own brand assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to read their own files
create policy "Users can read own brand assets"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow authenticated users to delete their own files
create policy "Users can delete own brand assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
