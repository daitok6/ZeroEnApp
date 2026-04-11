# ZeroEn Platform — Deployment Guide

Deploy the ZeroEn marketing site and client dashboard to Vercel at `zeroen.dev`.

---

## 1. Prerequisites

- Node.js 20 or higher installed
- Vercel CLI installed globally:
  ```bash
  npm i -g vercel
  ```
- Stripe account with products created
- Supabase project created
- Resend account with domain verified

---

## 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → **New Project**. Note your project URL and anon key.

2. In **SQL Editor**, run each migration file in order:
   ```
   supabase/migrations/0001_profiles.sql
   supabase/migrations/0002_clients.sql
   supabase/migrations/0003_applications.sql
   supabase/migrations/0004_messages.sql
   supabase/migrations/0005_projects.sql
   supabase/migrations/0006_files.sql
   supabase/migrations/0007_analytics.sql
   supabase/migrations/0008_newsletter.sql
   supabase/migrations/0009_invoices.sql
   ```
   Copy each file's content into the SQL editor and click **Run**.

3. Enable Realtime for the `messages` table:
   - Table Editor → **messages** → click the settings icon → toggle **Realtime** on

4. Enable OAuth providers — go to **Authentication → Providers**:

   **Google:**
   - Toggle Google on
   - Enter your Google Cloud OAuth **Client ID** and **Client Secret**
   - Authorized redirect URI: `https://zeroen.dev/auth/callback`

   **GitHub:**
   - Toggle GitHub on
   - Enter your GitHub OAuth App **Client ID** and **Client Secret**
   - Authorization callback URL: `https://zeroen.dev/auth/callback`

5. Set the Auth site URL: **Authentication → URL Configuration**
   - Site URL: `https://zeroen.dev`
   - Add redirect URL: `https://zeroen.dev/auth/callback`

6. Copy credentials from **Project Settings → API**:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this private)

---

## 3. Stripe Setup

1. In the Stripe dashboard, create two subscription products for direct clients (JPY):

   **Basic Plan:**
   - Name: `ZeroEn Basic`
   - Pricing: **¥5,000 / month recurring** — currency: JPY, amount: `5000` (JPY is zero-decimal)
   - Note the **Price ID** → this is `STRIPE_BASIC_PRICE_ID`

   **Premium Plan:**
   - Name: `ZeroEn Premium`
   - Pricing: **¥10,000 / month recurring** — currency: JPY, amount: `10000`
   - Note the **Price ID** → this is `STRIPE_PREMIUM_PRICE_ID`

2. Create a webhook endpoint:
   - Stripe Dashboard → **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://zeroen.dev/api/stripe/webhook`
   - Select events to listen for:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`

3. After creating the webhook, copy the **Signing secret** (starts with `whsec_`).

4. Copy your **Secret key** (`sk_live_...`) and **Publishable key** (`pk_live_...`) from **Developers → API keys**.

5. Ensure your Stripe account has a **Privacy Policy URL** set:
   - Stripe Dashboard → **Settings → Public details**
   - Privacy policy URL: `https://zeroen.dev/en/privacy`

---

## 4. Resend Setup

1. Go to [resend.com](https://resend.com) → **Domains → Add Domain**
2. Enter `zeroen.dev` and add the DNS records shown to your registrar
3. Wait for domain verification (green checkmark)
4. Go to **API Keys → Create API Key** — copy the key (starts with `re_`)
5. Sender address used by the app: `noreply@zeroen.dev`

---

## 5. Environment Variables

Create a `.env.local` file in the project root (never commit this file):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=             # Project Settings → API → Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=        # Project Settings → API → anon public key
SUPABASE_SERVICE_ROLE_KEY=            # Project Settings → API → service_role key

# App
NEXT_PUBLIC_APP_URL=https://zeroen.dev
NEXT_PUBLIC_APP_NAME=ZeroEn
NEXT_PUBLIC_SITE_URL=https://zeroen.dev

# Stripe
STRIPE_SECRET_KEY=                    # sk_live_... (Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=   # pk_live_... (Developers → API keys)
STRIPE_WEBHOOK_SECRET=                # whsec_... (Developers → Webhooks → signing secret)
STRIPE_BASIC_PRICE_ID=               # price_... (ZeroEn Basic ¥5,000/mo JPY price ID)
STRIPE_PREMIUM_PRICE_ID=             # price_... (ZeroEn Premium ¥10,000/mo JPY price ID)

# Resend
RESEND_API_KEY=                       # re_... (Resend → API Keys)
RESEND_FROM_EMAIL=noreply@zeroen.dev

# Operator
OPERATOR_EMAIL=                       # Your email — receives application notifications
```

---

## 6. Vercel Deployment

1. Log in to Vercel CLI:
   ```bash
   vercel login
   ```

2. Link to a Vercel project (run from the `HQ/platform/` directory):
   ```bash
   vercel link
   ```
   Select **Create new project** or link to an existing one.

3. Add all environment variables to Vercel. Either:

   **Option A — CLI (one by one):**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   vercel env add NEXT_PUBLIC_APP_NAME
   vercel env add NEXT_PUBLIC_SITE_URL
   vercel env add STRIPE_SECRET_KEY
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add STRIPE_BASIC_PRICE_ID
   vercel env add STRIPE_PREMIUM_PRICE_ID
   vercel env add RESEND_API_KEY
   vercel env add RESEND_FROM_EMAIL
   vercel env add OPERATOR_EMAIL
   ```
   Select **Production** (and optionally Preview) for each.

   **Option B — Vercel Dashboard:**
   - Project → **Settings → Environment Variables**
   - Add each variable with scope set to **Production**

4. Deploy to production:
   ```bash
   vercel --prod
   ```

5. Add the custom domain:
   - Vercel Dashboard → Project → **Settings → Domains**
   - Click **Add** → enter `zeroen.dev`
   - Vercel will show the DNS records to add

6. Update DNS at your registrar:
   - For the apex domain (`zeroen.dev`): add an **A record** pointing to Vercel's IP (shown in dashboard)
   - For `www.zeroen.dev`: add a **CNAME** pointing to `cname.vercel-dns.com`
   - DNS propagation may take up to 24 hours

---

## 7. Supabase Storage Bucket

After the first deploy, create the storage bucket for client file uploads:

1. Supabase Dashboard → **Storage → New Bucket**
2. Bucket name: `project-files`
3. Toggle **Public bucket** OFF (keep it private)
4. Click **Create bucket**
5. Add an RLS policy:
   - **Storage → project-files → Policies → New Policy**
   - Policy name: `Authenticated project members only`
   - Allowed operations: `SELECT`, `INSERT`, `UPDATE`, `DELETE`
   - Policy expression (adapt as needed):
     ```sql
     auth.role() = 'authenticated'
     ```
   - Refine further to restrict by project membership once the schema is confirmed

---

## 8. Post-Deploy Verification

Work through this checklist after every production deploy:

- [ ] `zeroen.dev` loads with correct ZeroEn branding (Electric Green `#00E87A`, dark background)
- [ ] `/en` and `/ja` routes both load correctly
- [ ] Locale switcher toggles between EN and JP without errors
- [ ] Apply wizard (multi-step form) submits and saves a row to Supabase `applications` table
- [ ] Google OAuth login completes and redirects to dashboard
- [ ] GitHub OAuth login completes and redirects to dashboard
- [ ] Navigating to `/dashboard` while unauthenticated redirects to `/login`
- [ ] Dashboard messages: sending a message appears in real-time for both sender and recipient
- [ ] File upload in dashboard saves to Supabase Storage `project-files` bucket
- [ ] Stripe checkout opens in test mode (use `pk_test_` key temporarily to verify)
- [ ] Stripe webhook receives events — check **Stripe Dashboard → Developers → Webhooks → recent deliveries**
- [ ] Newsletter signup form saves email to Supabase `newsletter` table
- [ ] Blog posts render at `/en/blog` and `/ja/blog`
- [ ] `/sitemap.xml` is accessible and lists expected URLs
- [ ] `/robots.txt` returns correct rules
- [ ] OG image renders: visit `https://zeroen.dev/api/og?title=Test` in browser

---

## 9. Ongoing Operations

**Monthly:**
- Run the analytics report command for each active client:
  ```bash
  /report <clientId>
  ```
- Review the generated PDF before sending to the client

**Stripe monitoring:**
- Stripe Dashboard → **Developers → Webhooks** → view recent event deliveries
- Alert if any events show failed delivery (retry or investigate)

**Supabase monitoring:**
- Supabase Dashboard → **Logs → API logs** for errors
- Supabase Dashboard → **Database → Backups** — verify daily backups are running

**Vercel:**
- Monitor function logs at: Vercel Dashboard → Project → **Logs**
- Check deployment status and any build errors after each push to `main`
