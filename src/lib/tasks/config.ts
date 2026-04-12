// Operator timezone: change to 'Asia/Kuala_Lumpur' after Nov 2026 Malaysia move
export const OPERATOR_TZ = 'Asia/Tokyo';

// Morning digest recipient
export const DIGEST_TO = 'daito.k631@gmail.com';

// FROM address: update to 'ZeroEn <noreply@zeroen.dev>' once Resend domain is verified
export const DIGEST_FROM = 'ZeroEn <hello@zeroen.dev>';

// Cron schedule (used in vercel.json): 08:00 Asia/Tokyo = 23:00 UTC (standard time)
// UTC offset for Asia/Tokyo is +9, so 08:00 JST = 23:00 UTC previous day
export const DIGEST_CRON_UTC = '0 23 * * *';

// Backfill window on first deployment (days)
export const BACKFILL_DAYS = 30;
