'use client';

import { useState, type FormEvent } from 'react';

const SPEND_OPTIONS = [
  'Under US$1,000',
  'US$1,000–3,000',
  'US$3,000–5,000',
  'US$5,000–10,000',
  'US$10,000+',
  'Prefer not to say',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-mono)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-dim, #5A584F)',
  marginBottom: 6,
};

const fieldWrapStyle: React.CSSProperties = { marginBottom: 16 };

export function AuditInquiryForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? ''),
      company: String(formData.get('company') ?? ''),
      website: String(formData.get('website') ?? ''),
      email: String(formData.get('email') ?? ''),
      monthlySpend: String(formData.get('monthlySpend') ?? ''),
      question: String(formData.get('question') ?? ''),
      website2: String(formData.get('website2') ?? ''), // honeypot
    };

    try {
      const res = await fetch('/api/audit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          border: '2px solid var(--color-ink, #0A0A0A)',
          backgroundColor: 'var(--color-ink, #0A0A0A)',
          color: 'var(--color-bg, #E8E6DD)',
          padding: 24,
        }}
        role="status"
      >
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--color-accent, #00E87A)', marginBottom: 8 }}>
          ✓ Request received
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
          I&apos;ll reply by email — likely with a few questions before we confirm scope and access.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Honeypot — hidden from real users, left blank by them */}
      <div style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website2">Leave this field blank</label>
        <input type="text" id="website2" name="website2" tabIndex={-1} autoComplete="off" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={fieldWrapStyle}>
          <label htmlFor="name" style={labelStyle}>Name *</label>
          <input id="name" name="name" type="text" required maxLength={200} className="bt-field" />
        </div>
        <div style={fieldWrapStyle}>
          <label htmlFor="company" style={labelStyle}>Company *</label>
          <input id="company" name="company" type="text" required maxLength={200} className="bt-field" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={fieldWrapStyle}>
          <label htmlFor="website" style={labelStyle}>Website</label>
          <input id="website" name="website" type="url" placeholder="https://" maxLength={300} className="bt-field" />
        </div>
        <div style={fieldWrapStyle}>
          <label htmlFor="email" style={labelStyle}>Email *</label>
          <input id="email" name="email" type="email" required maxLength={200} className="bt-field" />
        </div>
      </div>

      <div style={fieldWrapStyle}>
        <label htmlFor="monthlySpend" style={labelStyle}>Approximate monthly Meta Ads spend (optional)</label>
        <select id="monthlySpend" name="monthlySpend" defaultValue="" className="bt-field">
          <option value="">Select a range</option>
          {SPEND_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div style={fieldWrapStyle}>
        <label htmlFor="question" style={labelStyle}>What would you like a second opinion on? *</label>
        <textarea id="question" name="question" required maxLength={2000} rows={4} className="bt-field" style={{ resize: 'vertical' }} />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="bt-hover-shadow"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'var(--color-accent, #00E87A)',
          color: 'var(--color-ink, #0A0A0A)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          border: '2px solid var(--color-ink, #0A0A0A)',
          boxShadow: '4px 4px 0 var(--color-ink, #0A0A0A)',
          padding: '12px 20px',
          cursor: status === 'submitting' ? 'default' : 'pointer',
          opacity: status === 'submitting' ? 0.6 : 1,
        }}
      >
        <span aria-hidden="true">►</span> {status === 'submitting' ? 'Sending…' : 'Request an audit'}
      </button>

      {status === 'error' && (
        <p role="alert" style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-danger, #C8351E)', marginTop: 12, lineHeight: 1.6 }}>
          Something went wrong sending this. Please email me directly instead:{' '}
          <a href="mailto:daito@zeroen.dev" className="bt-link" style={{ color: 'var(--color-ink, #0A0A0A)', fontWeight: 700 }}>
            daito@zeroen.dev
          </a>
        </p>
      )}
    </form>
  );
}
