const ERRORS: Record<string, { en: string; ja: string }> = {
  'errors.businessNameRequired': {
    en: 'Please enter your business name.',
    ja: '事業名を入力してください。',
  },
  'errors.businessNameTooLong': {
    en: 'Business name is too long (max 120 characters).',
    ja: '事業名が長すぎます（120文字以内）。',
  },
  'errors.industryRequired': {
    en: 'Please tell us your industry.',
    ja: '業種を入力してください。',
  },
  'errors.timezoneRequired': {
    en: 'Please select your timezone.',
    ja: 'タイムゾーンを選択してください。',
  },
  'errors.colorFormat': {
    en: 'Use a hex color like #00E87A.',
    ja: '#00E87A のような16進カラーを入力してください。',
  },
  'errors.targetAudienceTooShort': {
    en: 'Please describe your audience in a bit more detail.',
    ja: 'ターゲットについてもう少し詳しく教えてください。',
  },
  'errors.primaryCtaRequired': {
    en: 'Please enter your main call-to-action.',
    ja: 'メインのCTAを入力してください。',
  },
  'errors.keyOfferingsMin': {
    en: 'Add at least one offering.',
    ja: 'サービスを1つ以上追加してください。',
  },
  'errors.urlInvalid': {
    en: "That doesn't look like a valid link.",
    ja: 'リンクの形式を確認してください。',
  },
  'errors.termsRequired': {
    en: 'You must accept the terms to continue.',
    ja: '続けるには利用規約に同意してください。',
  },
};

const FALLBACK = {
  en: "Something doesn't look right. Please try again.",
  ja: '入力内容を確認してください。',
};

export function errorMsg(key: string | undefined, locale: string): string {
  if (!key) return '';
  const entry = ERRORS[key] ?? FALLBACK;
  return locale === 'ja' ? entry.ja : entry.en;
}
