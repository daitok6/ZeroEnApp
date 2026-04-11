import { buildMetadata } from '@/lib/seo/metadata';
import { GreenGlowLine } from '@/components/marketing/green-glow-line';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (locale === 'ja') {
    return buildMetadata({
      title: 'プライバシーポリシー — ZeroEn',
      description: 'ZeroEnのプライバシーポリシー。収集するデータ、使用方法、第三者サービスについて説明します。',
      path: '/privacy',
      locale,
      ogTitle: 'プライバシーポリシー',
      ogSubtitle: 'データの取り扱いについて',
    });
  }
  return buildMetadata({
    title: 'Privacy Policy — ZeroEn',
    description: "ZeroEn's privacy policy. What data we collect, how we use it, and your rights.",
    path: '/privacy',
    locale,
    ogTitle: 'Privacy Policy',
    ogSubtitle: 'How we handle your data',
  });
}

const SECTIONS_EN = [
  {
    title: '1. Who We Are',
    body: 'ZeroEn ("we", "us", "our") is a web development and hosting service operated by a Canadian sole proprietorship. Our website is zeroen.dev. For privacy inquiries, contact: hello@zeroen.dev.',
  },
  {
    title: '2. Data We Collect',
    body: `We collect the following information when you use our service:

**Account data:** Name, email address, and password (managed via Supabase Auth). You may also sign in with Google or GitHub, in which case we receive your public profile information from that provider.

**Project data:** Website preferences, content, and feedback you provide during onboarding and change requests.

**Payment data:** Billing is processed by Stripe. We store your Stripe Customer ID to link payments to your account. We do not store full card numbers or CVV codes — these are handled entirely by Stripe.

**Usage data:** Server logs, page views, and analytics collected by Vercel Analytics (anonymised, no cross-site tracking).

**Communications:** Messages you send through the dashboard are stored to maintain your project history.`,
  },
  {
    title: '3. How We Use Your Data',
    body: `We use your data to:
- Provide, maintain, and improve the ZeroEn service
- Process subscription payments and issue invoices
- Communicate about your project status, change requests, and billing
- Send transactional emails (project updates, payment confirmations) via Resend
- Comply with legal obligations`,
  },
  {
    title: '4. Third-Party Services',
    body: `We share data with the following processors:

**Supabase** (database and authentication) — supabase.com/privacy
**Stripe** (payment processing) — stripe.com/privacy
**Vercel** (hosting and analytics) — vercel.com/legal/privacy-policy
**Resend** (transactional email) — resend.com/legal/privacy-policy
**GitHub** (optional OAuth login) — docs.github.com/en/site-policy/privacy-policies/github-privacy-statement

We do not sell your data to any third party.`,
  },
  {
    title: '5. Data Retention',
    body: 'We retain your account and project data for the duration of your subscription plus 90 days after termination, to allow for reactivation. Payment records are retained for 7 years as required by tax law. You may request deletion of your data at any time by emailing hello@zeroen.dev.',
  },
  {
    title: '6. Your Rights',
    body: `Depending on your jurisdiction, you may have the right to:
- Access the personal data we hold about you
- Correct inaccurate data
- Request deletion of your data
- Object to or restrict processing
- Receive your data in a portable format

To exercise any of these rights, email hello@zeroen.dev.`,
  },
  {
    title: '7. Cookies',
    body: 'We use essential session cookies for authentication. We do not use advertising or tracking cookies. Vercel Analytics uses anonymised, cookie-free metrics.',
  },
  {
    title: '8. Security',
    body: 'Data is encrypted in transit (TLS) and at rest. Access to production systems is restricted to the operator. We follow security best practices including regular dependency audits.',
  },
  {
    title: '9. Changes to This Policy',
    body: 'We may update this policy from time to time. Material changes will be communicated via the dashboard. The current version is always available at zeroen.dev/privacy.',
  },
  {
    title: '10. Contact',
    body: 'For any privacy-related questions or requests: hello@zeroen.dev',
  },
];

const SECTIONS_JA = [
  {
    title: '1. 運営者について',
    body: 'ZeroEn（以下「当社」）は、カナダの個人事業主が運営するウェブ開発・ホスティングサービスです。ウェブサイト：zeroen.dev。プライバシーに関するお問い合わせ：hello@zeroen.dev',
  },
  {
    title: '2. 収集するデータ',
    body: `サービスご利用時に以下の情報を収集します。

**アカウントデータ：** 氏名、メールアドレス、パスワード（Supabase Auth で管理）。GoogleまたはGitHubでログインする場合、当該プロバイダーから公開プロフィール情報を受け取ります。

**プロジェクトデータ：** オンボーディングや変更リクエスト時にご提供いただいたウェブサイトの要望・コンテンツ・フィードバック。

**支払いデータ：** 決済はStripeが処理します。当社はStripeカスタマーIDのみを保存します。カード番号やCVVはStripeが管理し、当社は保存しません。

**利用データ：** Vercel Analytics が収集するサーバーログ・ページビュー・アクセス解析（匿名化済み、クロスサイトトラッキングなし）。

**メッセージ：** ダッシュボード経由のメッセージは、プロジェクト履歴のために保存されます。`,
  },
  {
    title: '3. データの利用目的',
    body: `収集したデータは以下の目的で使用します：
- ZeroEnサービスの提供・維持・改善
- サブスクリプション決済の処理および請求書の発行
- プロジェクト状況・変更リクエスト・請求に関する連絡
- Resend経由のトランザクションメール（プロジェクト更新・支払い確認）の送信
- 法的義務の遵守`,
  },
  {
    title: '4. 第三者サービス',
    body: `以下の処理業者とデータを共有します：

**Supabase**（データベース・認証）— supabase.com/privacy
**Stripe**（決済処理）— stripe.com/privacy
**Vercel**（ホスティング・アナリティクス）— vercel.com/legal/privacy-policy
**Resend**（トランザクションメール）— resend.com/legal/privacy-policy
**GitHub**（任意のOAuthログイン）— docs.github.com

第三者へのデータ販売は一切行いません。`,
  },
  {
    title: '5. データ保持期間',
    body: 'アカウントおよびプロジェクトデータは、サブスクリプション期間中および終了後90日間保持します（再有効化のため）。税法上の要件により、支払い記録は7年間保持します。データの削除を希望される場合は hello@zeroen.dev までご連絡ください。',
  },
  {
    title: '6. お客様の権利',
    body: `お客様は以下の権利を有する場合があります：
- 当社が保持する個人データへのアクセス
- 不正確なデータの訂正
- データの削除要求
- 処理への異議申し立てまたは制限
- データのポータビリティ形式での受け取り

これらの権利を行使するには hello@zeroen.dev までご連絡ください。`,
  },
  {
    title: '7. クッキー',
    body: '認証用の必須セッションクッキーを使用します。広告・トラッキングクッキーは使用しません。Vercel Analyticsは匿名化されたクッキーフリーの指標を使用します。',
  },
  {
    title: '8. セキュリティ',
    body: 'データは転送時（TLS）および保存時に暗号化されます。本番環境へのアクセスは運営者に限定されています。定期的な依存関係の監査を含むセキュリティのベストプラクティスに従っています。',
  },
  {
    title: '9. ポリシーの変更',
    body: '本ポリシーは随時更新される場合があります。重要な変更はダッシュボード経由でお知らせします。最新版は常に zeroen.dev/privacy でご確認いただけます。',
  },
  {
    title: '10. お問い合わせ',
    body: 'プライバシーに関するご質問・ご要望：hello@zeroen.dev',
  },
];

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const isJa = locale === 'ja';
  const sections = isJa ? SECTIONS_JA : SECTIONS_EN;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F2]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <p className="text-[#00E87A] font-mono text-xs uppercase tracking-[0.2em] mb-4">
          {isJa ? 'プライバシー' : 'Privacy'}
        </p>
        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-[#F4F4F2] mb-6">
          {isJa ? 'プライバシーポリシー' : 'Privacy Policy'}
        </h1>
        <p className="text-[#6B7280] font-mono text-sm max-w-md mx-auto">
          {isJa
            ? '最終更新：2026年4月11日'
            : 'Last updated: April 11, 2026'}
        </p>
        <GreenGlowLine className="mt-16" />
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-[#111827] border border-[#1F2937] rounded-lg p-6 md:p-8"
            >
              <h2 className="text-[#F4F4F2] font-heading font-bold text-lg mb-4">
                {section.title}
              </h2>
              <div className="text-[#9CA3AF] font-mono text-sm leading-relaxed whitespace-pre-line">
                {section.body.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={i} className="text-[#F4F4F2]">
                      {part.slice(2, -2)}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
