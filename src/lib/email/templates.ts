function emailWrapper(content: string): string {
  return `
    <div style="font-family: 'IBM Plex Mono', 'Courier New', monospace; background: #0D0D0D; color: #F4F4F2; padding: 0; margin: 0;">
      <div style="max-width: 560px; margin: 0 auto; padding: 40px 24px;">
        <div style="margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #374151;">
          <span style="color: #00E87A; font-size: 20px; font-weight: 700; letter-spacing: 0.05em;">ZeroEn</span>
        </div>
        ${content}
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #374151;">
          <p style="color: #6B7280; font-size: 11px; margin: 0; line-height: 1.6;">
            ZeroEn · <a href="https://zeroen.dev" style="color: #6B7280;">zeroen.dev</a> · Bring your idea to life.
          </p>
        </div>
      </div>
    </div>
  `;
}

function heading(text: string): string {
  return `<h1 style="color: #F4F4F2; font-size: 22px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.3;">${text}</h1>`;
}

function subheading(text: string): string {
  return `<p style="color: #9CA3AF; font-size: 13px; margin: 0 0 24px 0; line-height: 1.6;">${text}</p>`;
}

function body(text: string): string {
  return `<p style="color: #F4F4F2; font-size: 14px; margin: 0 0 16px 0; line-height: 1.7;">${text}</p>`;
}

function muted(text: string): string {
  return `<p style="color: #9CA3AF; font-size: 13px; margin: 0 0 12px 0; line-height: 1.6;">${text}</p>`;
}

function ctaButton(text: string, href: string): string {
  return `
    <a href="${href}" style="display: inline-block; background: #00E87A; color: #0D0D0D; font-size: 11px; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 4px; letter-spacing: 0.1em; text-transform: uppercase; margin: 16px 0;">
      ${text}
    </a>
  `;
}

function dataRow(label: string, value: string): string {
  return `
    <div style="display: flex; gap: 16px; padding: 8px 0; border-bottom: 1px solid #1F2937;">
      <span style="color: #6B7280; font-size: 12px; min-width: 140px; flex-shrink: 0;">${label}</span>
      <span style="color: #F4F4F2; font-size: 12px;">${value}</span>
    </div>
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
    subject: `[ZeroEn] New Application — ${data.ideaName}`,
    html: emailWrapper(`
      ${heading('New Application Received')}
      ${subheading(`${data.founderName} wants to build something.`)}
      <div style="border: 1px solid #374151; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        ${dataRow('Idea', data.ideaName)}
        ${dataRow('Founder', data.founderName)}
        ${dataRow('Email', data.founderEmail)}
        ${dataRow('Commitment', data.commitment)}
        ${dataRow('Locale', data.locale)}
      </div>
      ${body(`<strong style="color: #F4F4F2;">${data.ideaDescription}</strong>`)}
      ${muted(`Target users: ${data.targetUsers}`)}
      ${muted(`Monetization: ${data.monetization}`)}
      ${ctaButton('Review Application', 'https://zeroen.dev/en/dashboard')}
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
      ? `[ZeroEn] 採択されました — ${data.ideaName}`
      : `[ZeroEn] 申込結果について — ${data.ideaName}`
    : isAccepted
    ? `[ZeroEn] You're in — ${data.ideaName}`
    : `[ZeroEn] Application update — ${data.ideaName}`;

  const ev = data.evaluation;
  const scores = ev
    ? [ev.score_viability, ev.score_commitment, ev.score_feasibility, ev.score_market].filter((s) => s !== null) as number[]
    : [];
  const totalScore = scores.length === 4 ? scores.reduce((a, b) => a + b, 0) : null;

  const scoreBlock = ev && totalScore !== null ? `
    <div style="border: 1px solid #374151; border-radius: 8px; margin: 24px 0;">
      <div style="padding: 12px 16px; border-bottom: 1px solid #374151; display: flex; justify-content: space-between; align-items: center;">
        <span style="color: #9CA3AF; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">${isJa ? '評価結果' : 'Evaluation'}</span>
        <span style="color: ${totalScore >= 15 ? '#00E87A' : totalScore >= 12 ? '#FBBF24' : '#F87171'}; font-size: 13px; font-weight: 700;">${totalScore}/20</span>
      </div>
      ${[
        { label: isJa ? 'アイデア' : 'Idea Viability', score: ev.score_viability, note: ev.rationale?.viability },
        { label: isJa ? 'コミット' : 'Commitment', score: ev.score_commitment, note: ev.rationale?.commitment },
        { label: isJa ? '実現性' : 'Feasibility', score: ev.score_feasibility, note: ev.rationale?.feasibility },
        { label: isJa ? '市場性' : 'Market', score: ev.score_market, note: ev.rationale?.market },
      ].map((d) => `
        <div style="padding: 10px 16px; border-bottom: 1px solid #1F2937;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: #F4F4F2; font-size: 12px; font-weight: 600;">${d.label}</span>
            <span style="color: #9CA3AF; font-size: 12px;">${d.score ?? '—'}/5</span>
          </div>
          ${d.note ? `<p style="color: #9CA3AF; font-size: 11px; margin: 0; line-height: 1.6;">${d.note}</p>` : ''}
        </div>
      `).join('')}
      ${ev.rationale?.summary ? `
        <div style="padding: 12px 16px;">
          <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.7;">${ev.rationale.summary}</p>
        </div>
      ` : ''}
    </div>
  ` : '';

  const html = isAccepted
    ? emailWrapper(`
        ${heading(isJa ? '採択されました。' : "You're accepted.")}
        ${subheading(isJa ? `${data.founderName}さん、ZeroEnへようこそ。` : `Welcome to ZeroEn, ${data.founderName}.`)}
        ${body(isJa
          ? `${data.ideaName}のMVP構築を開始します。ダッシュボードにアクセスして、次のステップを確認してください。`
          : `We're building your MVP for ${data.ideaName}. Access your dashboard to see next steps and track progress.`
        )}
        ${scoreBlock}
        ${ctaButton(isJa ? 'ダッシュボードを開く' : 'Open Dashboard', data.dashboardUrl)}
        ${muted(isJa
          ? '今後、キックオフコールの案内をお送りします。'
          : "We'll be in touch shortly to schedule your kickoff call."
        )}
      `)
    : emailWrapper(`
        ${heading(isJa ? '今回は見送りとなりました。' : 'Not a fit right now.')}
        ${subheading(isJa ? `${data.founderName}さん、申し込みありがとうございました。` : `Thanks for applying, ${data.founderName}.`)}
        ${body(isJa
          ? `${data.ideaName}について審査しましたが、今回は採択に至りませんでした。`
          : `We reviewed your application for ${data.ideaName} and it's not a fit for us right now.`
        )}
        ${scoreBlock}
        ${muted(isJa
          ? 'アイデアが進化した際には、ぜひ再度お申し込みください。'
          : "We encourage you to apply again as your idea evolves. Keep building."
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
      ? `[ZeroEn] ${data.senderName}からメッセージ`
      : `[ZeroEn] New message from ${data.senderName}`,
    html: emailWrapper(`
      ${heading(isJa ? '新しいメッセージ' : 'New Message')}
      ${subheading(isJa
        ? `${data.senderName}さんが${data.projectName}にメッセージを送りました`
        : `${data.senderName} sent a message on ${data.projectName}`
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
      : `[ZeroEn] Payment due — ${amount}`,
    html: emailWrapper(`
      ${heading(isJa ? 'お支払いのご案内' : 'Payment Due')}
      ${subheading(isJa ? `${data.clientName}さん` : `Hi ${data.clientName}`)}
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
