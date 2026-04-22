export type HelpSection = {
  headingEn: string;
  headingJa: string;
  /** Paragraphs separated by \n\n. Lines starting with "- " become list items. */
  bodyEn: string;
  bodyJa: string;
};

export type HelpArticle = {
  slug: string;
  titleEn: string;
  titleJa: string;
  descEn: string;
  descJa: string;
  sections: HelpSection[];
};

export const helpArticles: HelpArticle[] = [
  {
    slug: 'getting-started',
    titleEn: 'Getting Started',
    titleJa: 'はじめに',
    descEn: 'What to expect after you subscribe — from first build to monthly operations.',
    descJa: 'ご契約後の流れ — 制作からサイト公開、その後の運用まで。',
    sections: [
      {
        headingEn: 'Your first week',
        headingJa: '最初の1週間',
        bodyEn:
          'Once your subscription is confirmed you will receive a welcome message in the Messages page. Here is what happens next:\n\n' +
          '- Step 1 — We set up your project. You will see your project appear in the Overview page.\n' +
          '- Step 2 — We build your site. This typically takes 3–5 business days from kickoff.\n' +
          '- Step 3 — You receive a preview link via Messages. Review the site and send feedback.\n' +
          '- Step 4 — We make any adjustments included in your plan, then ask for final approval.\n' +
          '- Step 5 — Your site goes live on your domain.',
        bodyJa:
          'サブスクリプションが確認されると、メッセージページにウェルカムメッセージが届きます。その後の流れは以下の通りです：\n\n' +
          '- ステップ1 — プロジェクトのセットアップを行います。概要ページにプロジェクトが表示されます。\n' +
          '- ステップ2 — サイトを制作します。キックオフから通常3〜5営業日かかります。\n' +
          '- ステップ3 — メッセージ経由でプレビューリンクをお送りします。確認してフィードバックをお送りください。\n' +
          '- ステップ4 — プランに含まれる調整を行い、最終承認をお願いします。\n' +
          '- ステップ5 — サイトがお客様のドメインで公開されます。',
      },
      {
        headingEn: 'Ongoing monthly operations',
        headingJa: '毎月の運用',
        bodyEn:
          'After launch, here is what you can expect each month:\n\n' +
          '- Monthly analytics PDF — sent to you via Messages around the 1st of each month.\n' +
          '- Included changes — Basic plan includes 1 small change/month. Premium includes 2 small or 1 medium change/month.\n' +
          '- Additional changes — Submit a change request for anything beyond your monthly allowance.',
        bodyJa:
          'サイト公開後、毎月以下のことが行われます：\n\n' +
          '- 月次アナリティクスPDF — 毎月1日頃にメッセージ経由でお送りします。\n' +
          '- プランに含まれる変更 — Basicプランは月1件の変更（小）、Premiumプランは月2件の変更（小）または1件の変更（中）が含まれます。\n' +
          '- 追加変更 — 月次枠を超える変更は、変更リクエストから申請してください。',
      },
    ],
  },

  {
    slug: 'dashboard-overview',
    titleEn: 'Dashboard Overview',
    titleJa: 'ダッシュボードの使い方',
    descEn: 'A guide to every section of your client dashboard.',
    descJa: 'クライアントダッシュボードの各セクションの説明。',
    sections: [
      {
        headingEn: 'Overview',
        headingJa: '概要',
        bodyEn:
          'The Overview page shows your project status, plan details, and quick links to other sections. It is the best place to check progress at a glance. Some sections are locked until your subscription is active and your project is set up.',
        bodyJa:
          '概要ページでは、プロジェクトの状況・プランの詳細・他セクションへのクイックリンクを確認できます。進捗を一目で確認できます。サブスクリプションが有効でプロジェクトが設定されるまで、一部のセクションはロックされています。',
      },
      {
        headingEn: 'Messages',
        headingJa: 'メッセージ',
        bodyEn:
          'All project communication happens here — questions, feedback, preview links, and status updates. We aim to respond within 1 business day (Mon–Fri, Japan time). You can start messaging before your project is fully set up.',
        bodyJa:
          'プロジェクトに関するやり取りはすべてここで行います — 質問・フィードバック・プレビューリンク・状況報告など。返信は1営業日以内を目安にしています（月〜金、日本時間）。プロジェクト設定前からメッセージを送ることができます。',
      },
      {
        headingEn: 'Documents',
        headingJa: '書類',
        bodyEn:
          'Your signed NDA and Partnership Agreement are stored here. You can expand each document to review the terms and download PDFs at any time.',
        bodyJa:
          '署名済みのNDA（秘密保持契約）とパートナーシップ契約書が保存されています。各書類を展開して内容を確認したり、いつでもPDFをダウンロードできます。',
      },
      {
        headingEn: 'Invoices',
        headingJa: '請求書',
        bodyEn:
          'Your billing history. Monthly subscription invoices and change-request invoices both appear here. You can pay outstanding invoices and download PDFs directly from this page.',
        bodyJa:
          '請求履歴を確認できます。月額サブスクリプション請求書と変更リクエストの請求書がここに表示されます。未払い請求書の支払いやPDFのダウンロードもこのページから行えます。',
      },
      {
        headingEn: 'Billing',
        headingJa: 'お支払い',
        bodyEn:
          'Manage your subscription plan. You can upgrade from Basic to Premium at any time. Downgrading is allowed after 3 months on Premium. Your plan tier and commitment end date are shown here.',
        bodyJa:
          'サブスクリプションプランを管理します。Basicからpremiumへのアップグレードはいつでも可能です。Premiumからのダウングレードはプレミアム加入後3ヶ月が経過してから可能です。プランと契約終了日が表示されます。',
      },
      {
        headingEn: 'Requests',
        headingJa: 'リクエスト',
        bodyEn:
          'Submit change requests for work beyond your original scope. Select the estimated size (Small / Medium / Large), describe the change, and submit. We will review and send an invoice if applicable.',
        bodyJa:
          '元の契約スコープ外の作業に対する変更リクエストを送信します。推定サイズ（Small / Medium / Large）を選択し、変更内容を説明して送信してください。確認後、必要に応じて請求書をお送りします。',
      },
      {
        headingEn: 'Settings',
        headingJa: '設定',
        bodyEn: 'Update your display name and account information.',
        bodyJa: '表示名やアカウント情報を更新できます。',
      },
      {
        headingEn: 'Analytics',
        headingJa: 'アナリティクス',
        bodyEn:
          'Download your monthly PDF analytics reports once your site is live. Premium tier clients also get access to a full-year dashboard view.',
        bodyJa:
          'サイト公開後、毎月のアナリティクスPDFレポートをダウンロードできます。Premiumプランのクライアントは年間ダッシュボードもご利用いただけます。',
      },
    ],
  },

  {
    slug: 'requesting-changes',
    titleEn: 'Requesting Changes',
    titleJa: '変更リクエストの送り方',
    descEn: 'How to submit a change request, what counts as small / medium / large, and what is included in your plan.',
    descJa: '変更リクエストの送り方、Small / Medium / Largeの定義、プランに含まれる変更枠について。',
    sections: [
      {
        headingEn: 'What is included in your plan',
        headingJa: 'プランに含まれる変更枠',
        bodyEn:
          'Your monthly subscription includes a free change allowance:\n\n' +
          '- Basic (¥10,000/mo) — 1 small change per month\n' +
          '- Premium (¥20,000/mo) — 2 small changes OR 1 medium change per month\n\n' +
          'Unused allowances do not carry over to the next month.',
        bodyJa:
          '月額サブスクリプションには無料の変更枠が含まれています：\n\n' +
          '- Basic（¥10,000/月）— 毎月1件のSmall変更\n' +
          '- Premium（¥20,000/月）— 毎月2件のSmall変更 または 1件のMedium変更\n\n' +
          '未使用の枠は翌月に繰り越されません。',
      },
      {
        headingEn: 'Change size definitions',
        headingJa: '変更サイズの定義',
        bodyEn:
          '- Small (¥4,000) — Minor text edits, color tweaks, button label changes, image swaps, small copy updates. Typically under 30 minutes of work.\n' +
          '- Medium (¥10,000) — New sections, form additions, layout restructuring, content updates across multiple pages. Typically 1–3 hours of work.\n' +
          '- Large (¥25,000+) — New pages, integrations, major redesigns, new features. Scoped and quoted individually.',
        bodyJa:
          '- Small（¥4,000）— テキスト修正・色の変更・ボタンラベル変更・画像差し替え・小規模なコピー更新など。通常30分以内の作業。\n' +
          '- Medium（¥10,000）— 新しいセクションの追加・フォーム追加・レイアウト変更・複数ページにわたるコンテンツ更新など。通常1〜3時間の作業。\n' +
          '- Large（¥25,000+）— 新しいページ・外部サービスとの連携・大規模なリデザイン・新機能追加など。個別にスコープと金額を確定します。',
      },
      {
        headingEn: 'How to submit a request',
        headingJa: 'リクエストの送り方',
        bodyEn:
          '1. Go to the Requests page.\n' +
          '2. Click "New Request" (the form is always visible at the top).\n' +
          '3. Write a clear title and a detailed description.\n' +
          '4. Select the estimated size (if you are unsure, choose the closest option — we will confirm before starting).\n' +
          '5. Submit. We will review within 1 business day and send an invoice if the change is out of your plan allowance.',
        bodyJa:
          '1. リクエストページを開きます。\n' +
          '2. ページ上部のフォームに入力します。\n' +
          '3. わかりやすいタイトルと詳細な説明を入力します。\n' +
          '4. 推定サイズを選択します（わからない場合は最も近いものを選んでください — 作業開始前に確認します）。\n' +
          '5. 送信します。1営業日以内に確認し、プランの枠を超える場合は請求書をお送りします。',
      },
    ],
  },

  {
    slug: 'invoices-and-billing',
    titleEn: 'Invoices & Billing',
    titleJa: '請求・支払いについて',
    descEn: 'How monthly billing works, upgrade / downgrade rules, and the 6-month minimum commitment.',
    descJa: '月次請求の仕組み・プラン変更のルール・6ヶ月最低利用期間について。',
    sections: [
      {
        headingEn: 'Monthly subscription billing',
        headingJa: '月額サブスクリプションの請求',
        bodyEn:
          'Your subscription renews automatically on the 1st of each month via Stripe. The charge appears on your card or bank account tied to your payment method. You can view all past invoices on the Invoices page.',
        bodyJa:
          'サブスクリプションはStripe経由で毎月1日に自動更新されます。登録されているカードまたは銀行口座に請求されます。過去の請求書はすべて請求書ページで確認できます。',
      },
      {
        headingEn: '6-month minimum commitment',
        headingJa: '6ヶ月最低利用期間',
        bodyEn:
          'All plans require a 6-month minimum commitment starting from your first subscription date. If you cancel before 6 months, you will be billed for the remaining months of your commitment. After 6 months, cancel anytime by contacting us via Messages with 30 days notice.',
        bodyJa:
          '全プランは初回サブスクリプション開始日から6ヶ月の最低利用期間があります。6ヶ月未満での解約の場合は、残月数分をご請求させていただきます。6ヶ月経過後は、メッセージで30日前に通知することでいつでも解約できます。',
      },
      {
        headingEn: 'Upgrade and downgrade',
        headingJa: 'アップグレードとダウングレード',
        bodyEn:
          '- Upgrade (Basic → Premium): Available at any time from the Billing page.\n' +
          '- Downgrade (Premium → Basic): Available after 3 months on the Premium plan.',
        bodyJa:
          '- アップグレード（Basic → Premium）：お支払いページからいつでも可能です。\n' +
          '- ダウングレード（Premium → Basic）：Premiumプランを3ヶ月ご利用後から可能です。',
      },
      {
        headingEn: 'Late payment policy',
        headingJa: '支払い遅延について',
        bodyEn:
          'If payment fails, you have a 14-day grace period to resolve it. After 14 days, your site will be paused. After 44 days total, your site will be archived. You can reactivate within 90 days by paying the outstanding balance.',
        bodyJa:
          '支払いが失敗した場合、14日間の猶予期間があります。14日を過ぎるとサイトが一時停止されます。合計44日を過ぎるとサイトがアーカイブされます。90日以内に未払い残高をお支払いいただくことで再開できます。',
      },
    ],
  },

  {
    slug: 'messages-and-documents',
    titleEn: 'Messages & Documents',
    titleJa: 'メッセージと書類',
    descEn: 'How to communicate with the team and where your signed contracts live.',
    descJa: 'チームとのやり取りの方法と、署名済み契約書の保管場所について。',
    sections: [
      {
        headingEn: 'Using Messages',
        headingJa: 'メッセージの使い方',
        bodyEn:
          'The Messages page is the primary channel for all project communication:\n\n' +
          '- Ask questions about your site or subscription\n' +
          '- Send feedback on previews or live changes\n' +
          '- Request urgent priority on a change (note: priority may incur extra cost)\n' +
          '- Receive preview links, status updates, and monthly report notifications\n\n' +
          'We aim to respond within 1 business day (Monday–Friday, Japan time). Messages sent on weekends or public holidays will be answered the next business day.',
        bodyJa:
          'メッセージページはプロジェクトに関するすべてのやり取りの主要チャンネルです：\n\n' +
          '- サイトやサブスクリプションに関する質問\n' +
          '- プレビューや変更後のフィードバック\n' +
          '- 変更の優先対応リクエスト（優先対応は追加費用が発生する場合があります）\n' +
          '- プレビューリンク・状況報告・月次レポートの通知を受け取る\n\n' +
          '返信は1営業日以内を目安にしています（月〜金、日本時間）。土日祝日のメッセージは翌営業日に返信します。',
      },
      {
        headingEn: 'Your Documents',
        headingJa: '書類について',
        bodyEn:
          'Two agreements are stored in your Documents page:\n\n' +
          '- Mutual Confidentiality Agreement (NDA) — Both parties agree not to share or use each other\'s confidential information. This is mutual: we are bound by the same terms.\n' +
          '- Partnership Agreement — Outlines the terms of your engagement: scope, subscription, ownership, minimum commitment, and change policy.\n\n' +
          'You can expand each document to review the terms in full and download a PDF at any time. Signed documents are permanently stored; they cannot be deleted.',
        bodyJa:
          '書類ページには2つの契約書が保管されています：\n\n' +
          '- 相互秘密保持契約（NDA）— 双方が互いの機密情報を共有・使用しないことに同意するものです。相互契約のため、ZeroEn側も同じ条件に拘束されます。\n' +
          '- パートナーシップ契約書 — スコープ・サブスクリプション・権利帰属・最低利用期間・変更ポリシーなど、契約条件を定めたものです。\n\n' +
          '各書類を展開して内容を確認し、いつでもPDFをダウンロードできます。署名済み書類は永続的に保管され、削除はできません。',
      },
    ],
  },

  {
    slug: 'analytics-reports',
    titleEn: 'Analytics Reports',
    titleJa: 'アナリティクスレポート',
    descEn: "What's in your monthly report, when it arrives, and how Basic and Premium differ.",
    descJa: '月次レポートの内容、配信タイミング、BasicとPremiumの違いについて。',
    sections: [
      {
        headingEn: "What's included in each report",
        headingJa: 'レポートの内容',
        bodyEn:
          'Every monthly PDF includes:\n\n' +
          '- Total visitors and unique sessions\n' +
          '- Page views and pages per session\n' +
          '- Top 10 most visited pages\n' +
          '- Load performance scores (Core Web Vitals)\n' +
          '- Month-over-month comparison (from month 2 onwards)',
        bodyJa:
          '毎月のPDFには以下が含まれます：\n\n' +
          '- 総訪問者数とユニークセッション数\n' +
          '- ページビュー数とセッションあたりのページ数\n' +
          '- 最も閲覧されたページ TOP 10\n' +
          '- ロードパフォーマンススコア（Core Web Vitals）\n' +
          '- 前月比（2ヶ月目以降）',
      },
      {
        headingEn: 'When reports arrive',
        headingJa: 'レポートの配信タイミング',
        bodyEn:
          'Your first report arrives approximately 1 month after your site goes live. Subsequent reports are delivered on the 1st of each month via Messages. You will receive a notification when a new report is available for download.',
        bodyJa:
          '最初のレポートはサイト公開後約1ヶ月で届きます。以降は毎月1日にメッセージ経由で配信されます。新しいレポートがダウンロード可能になるとお知らせが届きます。',
      },
      {
        headingEn: 'Basic vs Premium',
        headingJa: 'BasicとPremiumの違い',
        bodyEn:
          '- Basic — Receives the prior-month PDF report only.\n' +
          '- Premium — Receives the PDF report plus access to a full-year analytics dashboard showing trends across all months.',
        bodyJa:
          '- Basic — 前月分のPDFレポートのみ受け取れます。\n' +
          '- Premium — PDFレポートに加え、全月のトレンドが見られる年間アナリティクスダッシュボードにアクセスできます。',
      },
    ],
  },

  {
    slug: 'faq',
    titleEn: 'FAQ',
    titleJa: 'よくある質問',
    descEn: 'Answers to the most common questions about your subscription, ownership, and policies.',
    descJa: 'サブスクリプション・権利帰属・各種ポリシーに関するよくある質問。',
    sections: [
      {
        headingEn: 'Can I cancel at any time?',
        headingJa: 'いつでも解約できますか？',
        bodyEn:
          'All plans have a 6-month minimum commitment. After 6 months, you can cancel anytime by sending us a message with 30 days notice. Early cancellation before 6 months will be billed for the remaining months of your commitment.',
        bodyJa:
          '全プランは6ヶ月の最低利用期間があります。6ヶ月経過後は、30日前にメッセージでお知らせいただければいつでも解約できます。6ヶ月未満の早期解約は、残月数分をご請求させていただきます。',
      },
      {
        headingEn: 'Who owns the website code?',
        headingJa: 'ウェブサイトのコードは誰のものですか？',
        bodyEn:
          'ZeroEn retains ownership of the code. You license the live website through your active subscription — as long as you subscribe, your site remains live and you have full use of it.',
        bodyJa:
          'コードの所有権はZeroEnが保持します。アクティブなサブスクリプションを通じて、公開中のウェブサイトをライセンス利用していただきます — サブスクリプションが有効な限り、サイトは公開され続けます。',
      },
      {
        headingEn: 'Who owns my domain?',
        headingJa: 'ドメインは誰のものですか？',
        bodyEn:
          'You own your domain. ZeroEn only manages the DNS settings to point your domain at the hosted site. You can reassign your domain to any other provider at any time.',
        bodyJa:
          'ドメインはお客様の所有物です。ZeroEnはDNS設定を管理して、ドメインをホストされたサイトに向けるだけです。いつでも他のプロバイダーにドメインを移行できます。',
      },
      {
        headingEn: 'How is billing handled?',
        headingJa: '請求はどのように行われますか？',
        bodyEn:
          'Your monthly subscription is billed directly through ZeroEn via Stripe on zeroen.dev. All recurring fees (¥10,000 or ¥20,000/month) are charged to the card on file on the same day each month.',
        bodyJa:
          '月額サブスクリプションは、zeroen.dev上のStripe経由でZeroEnから直接請求されます。継続的な費用（月¥10,000または¥20,000）は、毎月同じ日にご登録のカードに請求されます。',
      },
      {
        headingEn: 'How quickly do you respond to messages?',
        headingJa: 'メッセージへの返信はどのくらいかかりますか？',
        bodyEn:
          'We aim to respond within 1 business day (Monday–Friday, Japan time). Messages sent on weekends or public holidays will be answered on the next business day.',
        bodyJa:
          '1営業日以内の返信を目安にしています（月〜金、日本時間）。土日祝日のメッセージは翌営業日に返信します。',
      },
      {
        headingEn: 'What if my site breaks after a change?',
        headingJa: '変更後にサイトが壊れた場合はどうなりますか？',
        bodyEn:
          'All changes go through a quality gate (lint, build, and test checks) before deployment. In the unlikely event that a bug reaches production, we fix it at no charge as part of normal operations — contact us via Messages.',
        bodyJa:
          'すべての変更はデプロイ前に品質チェック（lint・ビルド・テスト）を通過します。万が一バグが本番環境に出た場合は、通常運用の一環として無償で修正します — メッセージからお知らせください。',
      },
      {
        headingEn: 'Can I request an urgent / priority turnaround?',
        headingJa: '緊急・優先対応のリクエストはできますか？',
        bodyEn:
          'Yes. Mention "priority" in your change request and describe your deadline. Priority handling may incur an additional charge depending on urgency and scope. We will confirm the cost before starting.',
        bodyJa:
          'はい。変更リクエストに「優先」と記載し、締め切りを教えてください。緊急度とスコープに応じて追加料金が発生する場合があります。作業開始前に費用を確認します。',
      },
    ],
  },
];

export function getArticle(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}
