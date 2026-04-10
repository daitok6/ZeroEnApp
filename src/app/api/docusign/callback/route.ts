import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const event = searchParams.get('event');
  const envelopeId = searchParams.get('envelopeId') ?? '';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Signing Complete</title>
<style>
  body { font-family: monospace; background: #0D0D0D; color: #F4F4F2; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
  .box { text-align: center; }
  p { color: #6B7280; font-size: 14px; margin-top: 8px; }
</style>
</head>
<body>
<div class="box">
  ${event === 'signing_complete'
    ? '<p style="color:#00E87A;font-size:18px;">✓ Agreement signed</p><p>Closing window...</p>'
    : '<p>Signing cancelled.</p><p>Closing window...</p>'
  }
</div>
<script>
  try {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'docusign-complete', event: ${JSON.stringify(event)}, envelopeId: ${JSON.stringify(envelopeId)} },
        window.location.origin
      );
    }
  } catch (e) {}
  setTimeout(() => window.close(), 1500);
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
