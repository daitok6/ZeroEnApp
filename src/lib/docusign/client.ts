import {
  ApiClient,
  EnvelopesApi,
  type Document,
  type EnvelopeDefinition,
  type Signer,
  type SignHere,
  type DateSigned,
  type Tabs,
  type Recipients,
  type RecipientViewRequest,
} from 'docusign-esign';

const INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY!;
const SECRET_KEY = process.env.DOCUSIGN_SECRET_KEY!;
const ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID!;
const USER_ID = process.env.DOCUSIGN_USER_ID!;
const BASE_URL = process.env.DOCUSIGN_BASE_URL ?? 'https://demo.docusign.net/restapi';
const OAUTH_BASE = process.env.DOCUSIGN_OAUTH_BASE ?? 'account-d.docusign.com';

// Partnership agreement terms as an HTML document
const AGREEMENT_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>ZeroEn Partnership Agreement</title>
<style>
body{font-family:sans-serif;max-width:700px;margin:40px auto;color:#111;line-height:1.6}
h1{font-size:22px;margin-bottom:8px}h2{font-size:16px;margin-top:24px}
table{width:100%;border-collapse:collapse;margin:16px 0}
td,th{padding:10px 12px;border:1px solid #ddd;text-align:left}
th{background:#f5f5f5;font-weight:600}
</style>
</head>
<body>
<h1>ZeroEn Partnership Agreement</h1>
<p>This preliminary partnership agreement ("Agreement") is between ZeroEn ("Operator") and the signing party ("Founder").</p>
<h2>Key Terms</h2>
<table>
<tr><th>Term</th><th>Detail</th></tr>
<tr><td>Equity</td><td>10% via SAFE note (converts on incorporation)</td></tr>
<tr><td>Revenue Share</td><td>~10% of app revenue (flexible per deal)</td></tr>
<tr><td>Platform Fee</td><td>$50/mo after launch (hosting + 1 fix/mo)</td></tr>
<tr><td>MVP Scope</td><td>Locked at kickoff. Changes are charged separately.</td></tr>
<tr><td>IP Ownership</td><td>Shared — proportional to equity stake</td></tr>
<tr><td>Kill Switch</td><td>90 days unpaid → agreement terminates, code rights to operator</td></tr>
<tr><td>Reversion</td><td>No launch in 6 months → code rights revert to operator</td></tr>
<tr><td>Portfolio Rights</td><td>Operator retains right to showcase the work</td></tr>
</table>
<h2>Agreement</h2>
<p>By signing below, the Founder acknowledges and agrees to the above terms as a preliminary agreement. A formal legal agreement will follow.</p>
<br><br>
<p>Founder Signature: \Sig1\</p>
<p>Date: \Date1\</p>
</body>
</html>`;

async function getAccessToken(): Promise<string> {
  const apiClient = new ApiClient({
    basePath: `https://${OAUTH_BASE}`,
    oAuthBasePath: OAUTH_BASE,
  });

  const response = await apiClient.requestJWTUserToken(
    INTEGRATION_KEY,
    USER_ID,
    ['signature', 'impersonation'],
    Buffer.from(SECRET_KEY),
    3600
  );
  return (response as { body: { access_token: string } }).body.access_token;
}

export async function createEnvelope(
  signerEmail: string,
  signerName: string,
  clientUserId: string
): Promise<{ envelopeId: string }> {
  const accessToken = await getAccessToken();

  const apiClient = new ApiClient({ basePath: BASE_URL, oAuthBasePath: OAUTH_BASE });
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

  const envelopesApi = new EnvelopesApi(apiClient);

  const document: Document = {
    documentBase64: Buffer.from(AGREEMENT_HTML).toString('base64'),
    name: 'ZeroEn Partnership Agreement',
    fileExtension: 'html',
    documentId: '1',
  };

  const signHereTab: SignHere = {
    anchorString: '\\Sig1\\',
    anchorYOffset: '-5',
    anchorUnits: 'pixels',
    anchorXOffset: '0',
  };

  const dateSignedTab: DateSigned = {
    anchorString: '\\Date1\\',
    anchorYOffset: '-5',
    anchorUnits: 'pixels',
    anchorXOffset: '0',
  };

  const tabs: Tabs = {
    signHereTabs: [signHereTab],
    dateSignedTabs: [dateSignedTab],
  };

  const signer: Signer = {
    email: signerEmail,
    name: signerName,
    clientUserId,
    recipientId: '1',
    tabs,
  };

  const recipients: Recipients = { signers: [signer] };

  const envelope: EnvelopeDefinition = {
    emailSubject: 'ZeroEn Partnership Agreement — Please Sign',
    documents: [document],
    recipients,
    status: 'sent',
  };

  const result = await envelopesApi.createEnvelope(ACCOUNT_ID, { envelopeDefinition: envelope });
  return { envelopeId: result.envelopeId! };
}

export async function getSigningUrl(
  envelopeId: string,
  signerEmail: string,
  signerName: string,
  clientUserId: string,
  returnUrl: string
): Promise<{ signingUrl: string }> {
  const accessToken = await getAccessToken();

  const apiClient = new ApiClient({ basePath: BASE_URL, oAuthBasePath: OAUTH_BASE });
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

  const envelopesApi = new EnvelopesApi(apiClient);

  const viewRequest: RecipientViewRequest = {
    authenticationMethod: 'none',
    clientUserId,
    recipientId: '1',
    returnUrl,
    userName: signerName,
    email: signerEmail,
  };

  const result = await envelopesApi.createRecipientView(ACCOUNT_ID, envelopeId, {
    recipientViewRequest: viewRequest,
  });

  return { signingUrl: (result as { url: string }).url };
}
