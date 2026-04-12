function emailWrapper(content: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #0D0D0D; margin: 0; padding: 0;">
      <tr>
        <td align="center" style="padding: 48px 16px 48px 16px;">
          <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; width: 100%;">

            <!-- Header -->
            <tr>
              <td style="padding-bottom: 32px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 22px; font-weight: 700; letter-spacing: 0.06em; text-decoration: none;">ZeroEn</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 16px;">
                      <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;">AI Technical Co-Founder</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td width="48" height="2" style="background: #00E87A; font-size: 0; line-height: 0;">&nbsp;</td>
                          <td width="8" height="2" style="font-size: 0; line-height: 0;">&nbsp;</td>
                          <td height="2" style="background: #1A2A1A; font-size: 0; line-height: 0;">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding-bottom: 0; font-family: 'IBM Plex Mono', 'Courier New', monospace;">
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding-top: 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td height="1" style="background: #1F2937; font-size: 0; line-height: 0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td>
                            <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #374151; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;">ZeroEn</span>
                            <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #1F2937; font-size: 10px;"> &nbsp;/&nbsp; </span>
                            <a href="https://zeroen.dev" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 10px; text-decoration: none; letter-spacing: 0.08em; opacity: 0.7;">zeroen.dev</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 8px;">
                            <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #374151; font-size: 10px; line-height: 1.7;">Build free. Grow together. &nbsp;You're receiving this because you applied to ZeroEn.</span>
                          </td>
                        </tr>
                      </table>
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
  return `<h1 style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 24px; font-weight: 700; margin: 0 0 10px 0; line-height: 1.25; letter-spacing: -0.01em;">${text}</h1>`;
}

function subheading(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 13px; margin: 0 0 32px 0; line-height: 1.7; letter-spacing: 0.02em;">${text}</p>`;
}

function body(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #D1D5DB; font-size: 14px; margin: 0 0 20px 0; line-height: 1.8;">${text}</p>`;
}

function muted(text: string): string {
  return `<p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 12px; margin: 0 0 14px 0; line-height: 1.7; letter-spacing: 0.02em;">${text}</p>`;
}

function ctaButton(text: string, href: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background: #00E87A; border-radius: 3px;">
                <a href="${href}" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; display: inline-block; background: #00E87A; color: #0D0D0D; font-size: 11px; font-weight: 700; text-decoration: none; padding: 16px 48px; border-radius: 3px; letter-spacing: 0.15em; text-transform: uppercase; white-space: nowrap;">${text}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function dataRow(label: string, value: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="140" valign="top" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #4B5563; font-size: 11px; padding: 10px 16px 10px 16px; letter-spacing: 0.06em; text-transform: uppercase; border-bottom: 1px solid #161616; vertical-align: top;">${label}</td>
        <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #E5E7EB; font-size: 12px; padding: 10px 16px 10px 0; border-bottom: 1px solid #161616; line-height: 1.6; vertical-align: top;">${value}</td>
      </tr>
    </table>
  `;
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
      ${subheading(`${data.founderName} applied with ${data.ideaName}.`)}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #374151; border-radius: 8px; margin-bottom: 24px;">
        <tr><td>
          ${dataRow('Idea', data.ideaName)}
          ${dataRow('Founder', data.founderName)}
          ${dataRow('Email', data.founderEmail)}
          ${dataRow('Commitment', data.commitment)}
          ${dataRow('Locale', data.locale)}
        </td></tr>
      </table>
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

  const scoreBlock = ev && totalScore !== null ? `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #374151; border-radius: 8px; margin: 28px 0;">
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #374151;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;">${isJa ? '評価結果' : 'Evaluation'}</td>
                    <td align="right" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: ${totalScore >= 15 ? '#00E87A' : totalScore >= 12 ? '#FBBF24' : '#F87171'}; font-size: 13px; font-weight: 700;">${totalScore}/20</td>
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
                <td style="padding: 10px 16px; border-bottom: 1px solid #1F2937;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #F4F4F2; font-size: 12px; font-weight: 600;">${d.label}</td>
                      <td align="right" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 12px;">${d.score ?? '—'}/5</td>
                    </tr>
                    ${d.note ? `<tr><td colspan="2" style="padding-top: 4px; font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; line-height: 1.6;">${d.note}</td></tr>` : ''}
                  </table>
                </td>
              </tr>
            `).join('')}
            ${ev.rationale?.summary ? `
              <tr>
                <td style="padding: 12px 16px;">
                  <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; margin: 0; line-height: 1.7;">${ev.rationale.summary}</p>
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
        ${subheading(isJa ? `${data.ideaName}を一緒に作りましょう。` : `Let's build ${data.ideaName}.`)}
        ${body(isJa
          ? '申し込みを審査し、採択しました。MVPの構築を進めます。ダッシュボードで次のステップとキックオフコールの日程調整リンクをご確認ください。'
          : `Your application was accepted. We're building your MVP — check your dashboard for next steps and a link to schedule your kickoff call.`
        )}
        ${scoreBlock}
        ${ctaButton(isJa ? 'ダッシュボードへ' : 'Go to Dashboard', data.dashboardUrl)}
        ${muted(isJa
          ? 'キックオフの詳細はダッシュボードに記載されています。'
          : "Kickoff call details will be in your dashboard. We move fast."
        )}
      `)
    : emailWrapper(`
        ${heading(isJa ? '今回は見送りとなりました。' : 'Not right now.')}
        ${subheading(isJa ? `${data.founderName}さん、ご応募ありがとうございました。` : `We reviewed your application, ${data.founderName}.`)}
        ${body(isJa
          ? `${data.ideaName}について審査しました。現時点では私たちの方向性と合わないと判断しましたが、これはアイデアの優劣ではなく、私たちの現在の状況によるものです。`
          : `We went through your application for ${data.ideaName}. It's not the right fit for us at this stage — the decision is about where we are, not where you are.`
        )}
        ${scoreBlock}
        ${muted(isJa
          ? 'アイデアが進化したり状況が変わった際には、ぜひ改めてご応募ください。'
          : "Ideas evolve. If yours does, apply again — we review every application on its own merits."
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

  return {
    subject: isJa
      ? `[ZeroEn] ${data.senderName}さんから${data.projectName}にメッセージが届きました`
      : `[ZeroEn] ${data.senderName} sent a message on ${data.projectName}`,
    html: emailWrapper(`
      ${heading(isJa ? '新しいメッセージ。' : 'New message.')}
      ${subheading(isJa
        ? `${data.senderName}さんが${data.projectName}にメッセージを送りました。`
        : `${data.senderName} wrote on ${data.projectName}.`
      )}
      <div style="border-left: 3px solid #00E87A; padding-left: 16px; margin: 16px 0;">
        ${body(`"${data.messagePreview}${data.messagePreview.length > 120 ? '...' : ''}"`)}
      </div>
      ${ctaButton(isJa ? 'メッセージを見る' : 'View Message', data.dashboardUrl)}
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
  const amount = `$${(data.amount / 100).toFixed(2)}`;

  return {
    subject: isJa
      ? `[ZeroEn] お支払いのご案内 — ${amount}`
      : `[ZeroEn] Platform fee due — ${amount}`,
    html: emailWrapper(`
      ${heading(isJa ? '請求書が届いています。' : 'Invoice ready.')}
      ${subheading(isJa ? `${data.clientName}さん、月額利用料のお支払い期限が近づいています。` : `${data.clientName}, your monthly platform fee is due.`)}
      <div style="border: 1px solid #374151; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        ${dataRow(isJa ? '内容' : 'Description', data.description)}
        ${dataRow(isJa ? '金額' : 'Amount', amount)}
        ${dataRow(isJa ? '支払期限' : 'Due Date', data.dueDate)}
      </div>
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
    <div style="border: 1px solid #374151; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: 'IBM Plex Mono', 'Courier New', monospace;">
      <p style="color: #9CA3AF; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 12px 0;">Acceptance Record</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0; width: 140px;">Signatory Name</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${signatureName}</td></tr>
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0;">Email</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${founderEmail}</td></tr>
        ${entityName ? `<tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0;">Entity</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${entityName}</td></tr>` : ''}
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0;">Terms Version</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${termsVersion}</td></tr>
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0;">Accepted At</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${formattedDate}</td></tr>
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0;">IP Address</td><td style="color: #F4F4F2; font-size: 11px; padding: 4px 0;">${ipAddress}</td></tr>
        <tr><td style="color: #6B7280; font-size: 11px; padding: 4px 0; vertical-align: top;">User Agent</td><td style="color: #4B5563; font-size: 10px; padding: 4px 0; word-break: break-all; line-height: 1.5;">${userAgent}</td></tr>
      </table>
    </div>
  `;

  const termsDetail = `
    <div style="border: 1px solid #1F2937; border-radius: 6px; padding: 14px 16px; margin: 16px 0;">
      <p style="color: #9CA3AF; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 12px 0;">Agreement Terms (${termsVersion})</p>
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
        ].map(([k, v]) => `<tr><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 11px; padding: 4px 0; width: 140px; vertical-align: top;">${k}</td><td style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #9CA3AF; font-size: 11px; padding: 4px 0;">${v}</td></tr>`).join('')}
      </table>
    </div>
  `;

  if (isOperatorCopy) {
    return {
      subject: `[ZeroEn] Agreement accepted — ${founderName} (${termsVersion})`,
      html: emailWrapper(`
        ${heading('New agreement signed.')}
        ${subheading(`${founderName} accepted the ZeroEn partnership terms.`)}
        ${evidenceBlock}
        ${termsDetail}
        <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; line-height: 1.7; margin: 0;">Keep this record for your files. The founder also received a copy at ${founderEmail}.</p>
      `),
    };
  }

  return {
    subject: `[ZeroEn] Your partnership agreement — confirmed`,
    html: emailWrapper(`
      ${heading('Agreement confirmed.')}
      ${subheading(`Welcome, ${founderName}. You're officially a ZeroEn partner.`)}
      <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #9CA3AF; font-size: 13px; line-height: 1.8; margin: 0 0 20px 0;">
        This email confirms that you electronically accepted the ZeroEn partnership agreement on ${formattedDate}. Keep this for your records.
      </p>
      ${evidenceBlock}
      ${termsDetail}
      <p style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; line-height: 1.7; margin: 16px 0 0 0;">
        Your electronic signature ("${signatureName}") and checkbox acceptance constitute a legally binding agreement under the U.S. Electronic Signatures in Global and National Commerce Act (E-SIGN) and equivalent regulations. If you have questions about these terms, reply to this email.
      </p>
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
    <div style="border: 1px solid #1F2937; border-radius: 6px; padding: 14px 16px; margin-bottom: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 13px; font-weight: 700;">${t.projectName}</span>
        <span style="font-family: 'IBM Plex Mono', 'Courier New', monospace; background: #00E87A; color: #0D0D0D; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 9999px;">${t.unreadCount}</span>
      </div>
      <div style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #6B7280; font-size: 11px; margin-bottom: 8px;">${t.clientName}</div>
      <div style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #9CA3AF; font-size: 12px; border-left: 2px solid #374151; padding-left: 10px; margin-bottom: 10px; font-style: italic;">"${t.latestMessage.length > 120 ? t.latestMessage.slice(0, 120) + '...' : t.latestMessage}"</div>
      <a href="${t.conversationUrl}" style="font-family: 'IBM Plex Mono', 'Courier New', monospace; color: #00E87A; font-size: 11px; text-decoration: none;">Reply →</a>
    </div>
  `).join('');

  return {
    subject: `[ZeroEn] ${totalUnread} unread message${totalUnread === 1 ? '' : 's'} from ${clientCount} client${clientCount === 1 ? '' : 's'}`,
    html: emailWrapper(`
      ${heading(`${totalUnread} unread.`)}
      ${subheading(`You have unread messages from ${clientCount} client${clientCount === 1 ? '' : 's'}.`)}
      <div style="margin: 20px 0;">
        ${threadRows}
      </div>
      ${ctaButton('Open Admin Dashboard', dashboardUrl)}
    `),
  };
}
