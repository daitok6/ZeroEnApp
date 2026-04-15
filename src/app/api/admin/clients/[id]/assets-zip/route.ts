import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import JSZip from 'jszip';

type Params = { params: Promise<{ id: string }> };

function getAdminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // Auth: must be logged in as admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Fetch brand row using service role (bypasses RLS)
  const adminSupabase = getAdminSupabase();
  const { data: brand } = await adminSupabase
    .from('client_brand')
    .select('logo_url, assets, business_name')
    .eq('profile_id', id)
    .single();

  if (!brand) {
    return NextResponse.json({ error: 'No brand data found' }, { status: 404 });
  }

  const zip = new JSZip();
  const slug = (brand.business_name as string | null)
    ?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || id;

  // Helper: download a file from storage by path and add to zip
  async function addStorageFile(storagePath: string, zipName: string) {
    const { data, error } = await adminSupabase.storage
      .from('brand-assets')
      .download(storagePath);
    if (error || !data) return;
    const buffer = await data.arrayBuffer();
    zip.file(zipName, buffer);
  }

  // Helper: extract storage path from a signed URL
  function extractPath(signedUrl: string): string | null {
    try {
      const url = new URL(signedUrl);
      const marker = '/object/sign/brand-assets/';
      const idx = url.pathname.indexOf(marker);
      if (idx === -1) return null;
      return url.pathname.slice(idx + marker.length);
    } catch {
      return null;
    }
  }

  const tasks: Promise<void>[] = [];

  // Logo
  if (brand.logo_url) {
    const logoPath = extractPath(brand.logo_url as string);
    if (logoPath) {
      const ext = logoPath.split('.').pop() || 'png';
      tasks.push(addStorageFile(logoPath, `logo.${ext}`));
    }
  }

  // Assets
  const rawAssets: { path: string; caption: string; content_type: string }[] =
    Array.isArray(brand.assets) ? (brand.assets as { path: string; caption: string; content_type: string }[]) : [];

  rawAssets.forEach((asset, i) => {
    const ext = asset.path.split('.').pop() || 'bin';
    tasks.push(addStorageFile(asset.path, `asset-${i + 1}.${ext}`));
  });

  await Promise.all(tasks);

  const zipBytes = await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  const blob = new Blob([zipBytes], { type: 'application/zip' });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}-brand.zip"`,
      'Content-Length': String(blob.size),
    },
  });
}
