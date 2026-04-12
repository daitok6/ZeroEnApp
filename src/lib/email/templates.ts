function emailWrapper(content: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; margin: 0; padding: 0;">

      <!-- Top accent strip -->
      <tr>
        <td height="3" style="background: #00E87A; font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>

      <!-- Body -->
      <tr>
        <td align="center" style="padding: 48px 16px 56px 16px;">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%; background: #111111; border: 1px solid #1F2937; border-radius: 16px;">

            <!-- Header -->
            <tr>
              <td style="padding: 32px 40px 28px 40px; border-bottom: 1px solid #1A1A1A;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 18px; font-weight: 700; letter-spacing: 0.06em;">ZeroEn</span>
                    </td>
                    <td align="right">
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #2D3748; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase;">zeroen.dev</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 40px 40px 0 40px; font-family: 'IBM Plex Mono', 'Courier New', monospace;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 32px 40px 36px 40px; border-top: 1px solid #1A1A1A; margin-top: 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #2D3748; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;">ZeroEn</span>
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #1F2937; font-size: 10px;">&nbsp;&nbsp;·&nbsp;&nbsp;</span>
                      <a href="https://zeroen.dev" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #374151; font-size: 10px; text-decoration: none; letter-spacing: 0.08em;">zeroen.dev</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 6px;">
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #2D3748; font-size: 10px; line-height: 1.7; letter-spacing: 0.04em;">AI Technical Co-Founder &nbsp;·&nbsp; You're receiving this because you applied to ZeroEn.</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  `;
}

function heading(text: string): string {
  return `<h1 style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.2; letter-spacing: -0.02em;">${text}</h1>`;
}

function subheading(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 14px; margin: 0 0 36px 0; line-height: 1.7; letter-spacing: 0.01em;">${text}</p>`;
}

function body(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #D1D5DB; font-size: 14px; margin: 0 0 20px 0; line-height: 1.85;">${text}</p>`;
}

function muted(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 12px; margin: 0 0 14px 0; line-height: 1.7; letter-spacing: 0.02em;">${text}</p>`;
}

function ctaButton(text: string, href: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 28px 0;">
      <tr>
        <td>
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background: #00E87A; border-radius: 4px;">
                <a href="${href}" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; display: inline-block; background: #00E87A; color: #0A0A0A; font-size: 11px; font-weight: 700; text-decoration: none; padding: 15px 40px; border-radius: 4px; letter-spacing: 0.16em; text-transform: uppercase; white-space: nowrap;">${text}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function divider(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;"><tr><td height="1" style="background: #1A1A1A; font-size: 0; line-height: 0;">&nbsp;</td></tr></table>`;
}

function dataRow(label: string, value: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="144" valign="top" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 10px; padding: 11px 16px 11px 20px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #171717; vertical-align: top;">${label}</td>
        <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #E5E7EB; font-size: 12px; padding: 11px 20px 11px 0; border-bottom: 1px solid #171717; line-height: 1.65; vertical-align: top;">${value}</td>
      </tr>
    </table>
  `;
}

function dataCard(rows: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-radius: 10px; margin-bottom: 28px;">${rows}</table>`;
}

// ── Email: New Application (to operator) ──────────────────
export function newApplicationEmail(data: {
  founderName: string;
  founderEmail: string;
  ideaName: string;
  ideaDescription: string;
  targetUsers: string;
  monetization: string;
  commitment: string;
  locale: string;
}): { subject: string; html: string } {
  return {
    subject: `[ZeroEn] New application: ${data.ideaName} — ${data.founderName}`,
    html: emailWrapper(`
      ${heading('New application.')}
      ${subheading(`${data.founderName} just applied with ${data.ideaName}.`)}
      ${dataCard(`
        <tr><td>
          ${dataRow('Idea', data.ideaName)}
          ${dataRow('Founder', data.founderName)}
          ${dataRow('Email', data.founderEmail)}
          ${dataRow('Commitment', data.commitment)}
          ${dataRow('Locale', data.locale)}
        </td></tr>
      `)}
      ${body(`<strong style="color: #F4F4F2;">${data.ideaDescription}</strong>`)}
      ${muted(`Target users: ${data.targetUsers}`)}
      ${muted(`Monetization: ${data.monetization}`)}
      ${ctaButton('Review Application', 'https://zeroen.dev/en/admin/applications')}
    `),
  };
}

// ── Email: Application Status Update (to founder) ─────────
export function applicationStatusEmail(data: {
  founderName: string;
  ideaName: string;
  status: 'accepted' | 'rejected';
  locale: 'en' | 'ja';
  dashboardUrl: string;
  evaluation?: {
    score_viability: number | null;
    score_commitment: number | null;
    score_feasibility: number | null;
    score_market: number | null;
    rationale: {
      viability?: string;
      commitment?: string;
      feasibility?: string;
      market?: string;
      recommendation?: string;
      summary?: string;
    } | null;
  };
}): { subject: string; html: string } {
  const isJa = data.locale === 'ja';
  const isAccepted = data.status === 'accepted';

  const subject = isJa
    ? isAccepted
      ? `[ZeroEn] ${data.ideaName}の採択について`
      : `[ZeroEn] ${data.ideaName}のご応募について`
    : isAccepted
    ? `[ZeroEn] You're in — next steps for ${data.ideaName}`
    : `[ZeroEn] Your ZeroEn application for ${data.ideaName}`;

  const ev = data.evaluation;
  const scores = ev
    ? [ev.score_viability, ev.score_commitment, ev.score_feasibility, ev.score_market].filter((s) => s !== null) as number[]
    : [];
  const totalScore = scores.length === 4 ? scores.reduce((a, b) => a + b, 0) : null;

  const scoreColor = totalScore !== null
    ? (totalScore >= 15 ? '#00E87A' : totalScore >= 12 ? '#FBBF24' : '#F87171')
    : '#6B7280';

  const scoreBlock = ev && totalScore !== null ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-radius: 10px; margin: 28px 0;">
      <tr>
        <td>
          <!-- Score header -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 14px 20px; border-bottom: 1px solid #1A1A1A;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">${isJa ? '評価結果' : 'Evaluation'}</td>
                    <td align="right" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: ${scoreColor}; font-size: 14px; font-weight: 700;">${totalScore}<span style="color: #374151; font-size: 11px;">/20</span></td>
                  </tr>
                </table>
              </td>
            </tr>
            ${[
              { label: isJa ? 'アイデア' : 'Idea Viability', score: ev.score_viability, note: ev.rationale?.viability },
              { label: isJa ? 'コミット' : 'Commitment', score: ev.score_commitment, note: ev.rationale?.commitment },
              { label: isJa ? '実現性' : 'Feasibility', score: ev.score_feasibility, note: ev.rationale?.feasibility },
              { label: isJa ? '市場性' : 'Market', score: ev.score_market, note: ev.rationale?.market },
            ].map((d) => `
              <tr>
                <td style="padding: 12px 20px; border-bottom: 1px solid #171717;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #D1D5DB; font-size: 12px;">${d.label}</td>
                      <td align="right" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 12px; white-space: nowrap;">${d.score ?? '—'}<span style="color: #374151;">/5</span></td>
                    </tr>
                    ${d.note ? `<tr><td colspan="2" style="padding-top: 5px; font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; line-height: 1.65;">${d.note}</td></tr>` : ''}
                  </table>
                </td>
              </tr>
            `).join('')}
            ${ev.rationale?.summary ? `
              <tr>
                <td style="padding: 14px 20px;">
                  <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; margin: 0; line-height: 1.75;">${ev.rationale.summary}</p>
                </td>
              </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
  ` : '';

  const html = isAccepted
    ? emailWrapper(`
        ${heading(isJa ? '採択されました。' : "You're in.")}
        ${subheading(isJa ? `${data.ideaName}を一緒に作りましょう。` : `Time to build ${data.ideaName}.`)}
        ${body(isJa
          ? '申し込みを審査し、採択しました。MVPの構築を進めます。ダッシュボードで次のステップとキックオフコールの日程調整リンクをご確認ください。'
          : `Your application cleared review. We're building your MVP — log in to your dashboard to see next steps and schedule your kickoff call.`
        )}
        ${scoreBlock}
        ${ctaButton(isJa ? 'ダッシュボードへ' : 'Go to Dashboard', data.dashboardUrl)}
        ${muted(isJa
          ? 'キックオフの詳細はダッシュボードに記載されています。'
          : "Kickoff details are waiting in your dashboard. We move fast."
        )}
      `)
    : emailWrapper(`
        ${heading(isJa ? '今回は見送りとなりました。' : 'Not this time.')}
        ${subheading(isJa ? `${data.founderName}さん、ご応募ありがとうございました。` : `We reviewed your application, ${data.founderName}.`)}
        ${body(isJa
          ? `${data.ideaName}について審査しました。現時点では私たちの方向性と合わないと判断しましたが、これはアイデアの優劣ではなく、私たちの現在の状況によるものです。`
          : `We went through your application for ${data.ideaName}. It's not the right fit for us at this stage — this is about where we are, not where you are.`
        )}
        ${scoreBlock}
        ${muted(isJa
          ? 'アイデアが進化したり状況が変わった際には、ぜひ改めてご応募ください。'
          : "Ideas evolve. If yours does, apply again — every application gets a fresh look."
        )}
      `);

  return { subject, html };
}

// ── Email: New Message Notification ───────────────────────
export function newMessageEmail(data: {
  recipientName: string;
  senderName: string;
  projectName: string;
  messagePreview: string;
  locale: 'en' | 'ja';
  dashboardUrl: string;
}): { subject: string; html: string } {
  const isJa = data.locale === 'ja';
  const preview = data.messagePreview.length > 140
    ? data.messagePreview.slice(0, 140) + '…'
    : data.messagePreview;

  return {
    subject: isJa
      ? `[ZeroEn] ${data.senderName}さんから${data.projectName}にメッセージが届きました`
      : `[ZeroEn] ${data.senderName} sent a message on ${data.projectName}`,
    html: emailWrapper(`
      ${heading(isJa ? '新しいメッセージ。' : 'New message.')}
      ${subheading(isJa
        ? `${data.senderName}さんが${data.projectName}にメッセージを送りました。`
        : `${data.senderName} · ${data.projectName}`
      )}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-left: 3px solid #00E87A; border-radius: 0 8px 8px 0; margin: 0 0 28px 0;">
        <tr>
          <td style="padding: 18px 20px;">
            <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #9CA3AF; font-size: 13px; margin: 0; line-height: 1.8; font-style: italic;">"${preview}"</p>
          </td>
        </tr>
      </table>
      ${ctaButton(isJa ? 'メッセージを見る' : 'Reply in Dashboard', data.dashboardUrl)}
    `),
  };
}

// ── Email: Invoice Due Reminder ────────────────────────────
export function invoiceDueEmail(data: {
  clientName: string;
  amount: number;
  description: string;
  dueDate: string;
  locale: 'en' | 'ja';
  payUrl: string;
}): { subject: string; html: string } {
  const isJa = data.locale === 'ja';
  const amount = `¥${data.amount.toLocaleString()}`;

  return {
    subject: isJa
      ? `[ZeroEn] お支払いのご案内 — ${amount}`
      : `[ZeroEn] Platform fee due — ${amount}`,
    html: emailWrapper(`
      ${heading(isJa ? '請求書が届いています。' : 'Invoice ready.')}
      ${subheading(isJa
        ? `${data.clientName}さん、月額利用料のお支払い期限が近づいています。`
        : `${data.clientName}, your monthly platform fee is due.`
      )}
      ${dataCard(`
        <tr><td>
          ${dataRow(isJa ? '内容' : 'Description', data.description)}
          ${dataRow(isJa ? '金額' : 'Amount', `<strong style="color: #F4F4F2; font-size: 14px;">${amount}</strong>`)}
          ${dataRow(isJa ? '支払期限' : 'Due', data.dueDate)}
        </td></tr>
      `)}
      ${ctaButton(isJa ? '今すぐ支払う' : 'Pay Now', data.payUrl)}
      ${muted(isJa
        ? 'ご不明な点はダッシュボードからお問い合わせください。'
        : 'Questions? Reply to this email or message us in your dashboard.'
      )}
    `),
  };
}

// ── Email: Agreement Acceptance Confirmation ───────────────
export function agreementConfirmationEmail(data: {
  founderName: string;
  founderEmail: string;
  signatureName: string;
  entityName: string | null;
  termsVersion: string;
  acceptedAt: string;
  ipAddress: string;
  userAgent: string;
  isOperatorCopy: boolean;
}): { subject: string; html: string } {
  const { founderName, founderEmail, signatureName, entityName, termsVersion, acceptedAt, ipAddress, userAgent, isOperatorCopy } = data;

  const formattedDate = new Date(acceptedAt).toUTCString();

  const evidenceBlock = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-radius: 10px; margin: 24px 0;">
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 12px 20px; border-bottom: 1px solid #1A1A1A;">
                <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">Acceptance Record</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0; width: 140px;">Signatory Name</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${signatureName}</td></tr>
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0;">Email</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${founderEmail}</td></tr>
                  ${entityName ? `<tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0;">Entity</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${entityName}</td></tr>` : ''}
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0;">Terms Version</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${termsVersion}</td></tr>
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0;">Accepted At</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${formattedDate}</td></tr>
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0;">IP Address</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 11px; padding: 4px 0;">${ipAddress}</td></tr>
                  <tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 4px 0; vertical-align: top;">User Agent</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #374151; font-size: 10px; padding: 4px 0; word-break: break-all; line-height: 1.55;">${userAgent}</td></tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const termsDetail = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #1F2937; border-radius: 10px; margin: 20px 0;">
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 12px 20px; border-bottom: 1px solid #1A1A1A;">
                <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">Agreement Terms (${termsVersion})</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  ${[
                    ['Equity', '10% via SAFE note (converts on incorporation)'],
                    ['Revenue Share', '~10% of app revenue (flexible per deal)'],
                    ['Platform Fee', '$50/mo after launch (hosting + 1 fix/mo)'],
                    ['MVP Scope', 'Locked at kickoff. Changes are charged separately.'],
                    ['IP Ownership', 'Shared — proportional to equity stake'],
                    ['Kill Switch', '90 days unpaid → agreement terminates, code rights to operator'],
                    ['Reversion', 'No launch within 6 months → code rights revert to operator'],
                    ['Portfolio Rights', 'Operator retains right to showcase this work at all times'],
                  ].map(([k, v]) => `<tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 11px; padding: 5px 0; width: 140px; vertical-align: top;">${k}</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; padding: 5px 0; line-height: 1.55;">${v}</td></tr>`).join('')}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  if (isOperatorCopy) {
    return {
      subject: `[ZeroEn] Agreement accepted — ${founderName} (${termsVersion})`,
      html: emailWrapper(`
        ${heading('New agreement signed.')}
        ${subheading(`${founderName} accepted the ZeroEn partnership terms.`)}
        ${evidenceBlock}
        ${termsDetail}
        ${muted(`Keep this record for your files. The founder also received a copy at ${founderEmail}.`)}
      `),
    };
  }

  return {
    subject: `[ZeroEn] Your partnership agreement — confirmed`,
    html: emailWrapper(`
      ${heading('Agreement confirmed.')}
      ${subheading(`Welcome, ${founderName}. You're officially a ZeroEn partner.`)}
      ${body(`This email confirms your electronic acceptance of the ZeroEn partnership agreement on ${formattedDate}. Keep it for your records.`)}
      ${evidenceBlock}
      ${termsDetail}
      ${muted(`Your electronic signature ("${signatureName}") and checkbox acceptance constitute a legally binding agreement under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN) and equivalent regulations. Questions? Reply to this email.`)}
    `),
  };
}

// ── Email: Site Ready Notification (to client) ────────────
export function siteReadyEmail(data: {
  clientName: string;
  locale: 'en' | 'ja';
  loginUrl: string;
}): { subject: string; html: string } {
  const isJa = data.locale === 'ja';

  return {
    subject: isJa
      ? '[ZeroEn] ウェブサイトの準備ができました'
      : '[ZeroEn] Your site is live',
    html: emailWrapper(`
      ${heading(isJa ? 'サイトの準備ができました。' : 'Your site is ready.')}
      ${subheading(isJa
        ? `${data.clientName}さん、ウェブサイトが完成しました。`
        : `${data.clientName}, we just shipped your website.`
      )}
      ${body(isJa
        ? 'ログインしてサイトをプレビューし、次のステップに進んでください。'
        : 'Log in to preview it, leave feedback, and get your launch checklist.'
      )}
      ${ctaButton(isJa ? 'ログインする' : 'Preview Your Site', data.loginUrl)}
      ${muted(isJa
        ? 'ご質問はダッシュボードのメッセージからお気軽にどうぞ。'
        : 'Questions or changes? Use the Messages tab in your dashboard.'
      )}
    `),
  };
}

// ── Email: Admin Message Digest ────────────────────────────
export function adminDigestEmail(data: {
  threads: Array<{
    projectName: string;
    clientName: string;
    unreadCount: number;
    latestMessage: string;
    conversationUrl: string;
  }>;
  totalUnread: number;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const { threads, totalUnread, dashboardUrl } = data;
  const clientCount = threads.length;

  const threadRows = threads.map((t) => `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-radius: 8px; margin-bottom: 10px;">
      <tr>
        <td style="padding: 14px 18px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 13px; font-weight: 700;">${t.projectName}</span>
                <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px;">&nbsp;·&nbsp;${t.clientName}</span>
              </td>
              <td align="right">
                <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; background: #00E87A; color: #0A0A0A; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 9999px;">${t.unreadCount}</span>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 10px;">
                <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 12px; margin: 0; line-height: 1.7; font-style: italic; border-left: 2px solid #252525; padding-left: 10px;">"${t.latestMessage.length > 120 ? t.latestMessage.slice(0, 120) + '…' : t.latestMessage}"</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 10px;">
                <a href="${t.conversationUrl}" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 11px; text-decoration: none; letter-spacing: 0.04em;">Reply →</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `).join('');

  return {
    subject: `[ZeroEn] ${totalUnread} unread message${totalUnread === 1 ? '' : 's'} from ${clientCount} client${clientCount === 1 ? '' : 's'}`,
    html: emailWrapper(`
      ${heading(`${totalUnread} unread.`)}
      ${subheading(`${clientCount} client${clientCount === 1 ? '' : 's'} waiting on you.`)}
      <div style="margin: 8px 0 24px 0;">
        ${threadRows}
      </div>
      ${ctaButton('Open Admin Dashboard', dashboardUrl)}
    `),
  };
}

// ── Email: Morning Task Digest (to operator) ───────────────────────────────
export function morningDigestEmail(data: {
  tasks: Array<{
    title: string;
    urgency: string;
    category: string;
    client_name: string | null;
    due_date: string;
  }>;
  date: string;
  dashboardUrl: string;
}): { subject: string; html: string } {
  const { tasks, date, dashboardUrl } = data;

  const URGENCY_COLORS: Record<string, string> = {
    critical: '#EF4444',
    high:     '#F59E0B',
    normal:   '#6B7280',
    low:      '#374151',
  };

  const CATEGORY_COLORS: Record<string, string> = {
    client_ops: '#3B82F6',
    billing:    '#F59E0B',
    marketing:  '#8B5CF6',
    content:    '#06B6D4',
    admin:      '#6B7280',
    personal:   '#EC4899',
  };

  const criticalCount = tasks.filter((t) => t.urgency === 'critical').length;
  const urgencyOrder = ['critical', 'high', 'normal', 'low'];
  const sorted = [...tasks].sort(
    (a, b) => urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency)
  );

  const taskRows = sorted.map((t) => `
    <tr>
      <td style="padding: 11px 20px; border-bottom: 1px solid #171717; vertical-align: top;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td>
              <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: ${URGENCY_COLORS[t.urgency] ?? '#6B7280'}; margin-right: 9px; vertical-align: middle;"></span>
              <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #E5E7EB; font-size: 13px;">${t.title}</span>
            </td>
            <td align="right" style="white-space: nowrap; padding-left: 12px;">
              <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; background: ${CATEGORY_COLORS[t.category] ?? '#374151'}22; color: ${CATEGORY_COLORS[t.category] ?? '#6B7280'}; font-size: 10px; padding: 2px 8px; border-radius: 9999px; letter-spacing: 0.06em;">${t.category.replace('_', ' ')}</span>
            </td>
          </tr>
          ${t.client_name ? `<tr><td colspan="2" style="padding-top: 4px; padding-left: 16px; font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px;">${t.client_name}</td></tr>` : ''}
        </table>
      </td>
    </tr>
  `).join('');

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const subject = criticalCount > 0
    ? `[ZeroEn] ${criticalCount} critical + ${tasks.length - criticalCount} more — ${formattedDate}`
    : `[ZeroEn] ${tasks.length} task${tasks.length === 1 ? '' : 's'} today — ${formattedDate}`;

  return {
    subject,
    html: emailWrapper(`
      ${heading(`${tasks.length} task${tasks.length === 1 ? '' : 's'} today.`)}
      ${subheading(formattedDate)}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; border: 1px solid #252525; border-radius: 10px; margin-bottom: 28px;">
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${taskRows}
          </table>
        </td></tr>
      </table>
      ${ctaButton('Open Task Dashboard', dashboardUrl)}
    `),
  };
}
