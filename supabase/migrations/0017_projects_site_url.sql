-- Add site_url column to projects for displaying the live site link in the client dashboard
alter table public.projects add column site_url text;
