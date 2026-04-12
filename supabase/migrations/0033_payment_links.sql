-- Payment links table — stores active Stripe Payment Link URLs for Basic/Premium plans.
-- Only one active row per plan_tier at a time (enforced by partial unique index).

CREATE TABLE public.payment_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_tier text NOT NULL CHECK (plan_tier IN ('basic', 'premium')),
  stripe_price_id text NOT NULL,
  stripe_payment_link_id text NOT NULL,
  url text NOT NULL,
  active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- Enforce only one active payment link per plan tier
CREATE UNIQUE INDEX payment_links_active_plan_tier
  ON public.payment_links (plan_tier)
  WHERE active = true;

-- Admin-only; clients never see this table
CREATE POLICY "Admins can manage payment links"
  ON public.payment_links FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
