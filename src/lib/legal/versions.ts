import fs from 'fs';
import path from 'path';

export const CURRENT_NDA_VERSION = 'v1.0-2026-04-10';
export const CURRENT_PARTNERSHIP_VERSION = 'v1.1-2026-04-12';

export type LegalDocumentType = 'nda' | 'partnership';

/**
 * Load the markdown body of a legal document by type, version, and locale.
 * Returns the raw markdown string.
 * Throws if the file does not exist (version/locale mismatch).
 */
export function loadLegalBody(
  type: LegalDocumentType,
  version: string,
  locale: 'en' | 'ja'
): string {
  const legalDir = path.join(process.cwd(), 'legal');
  const fileName = `${version}.${locale}.md`;
  const filePath = path.join(legalDir, type, fileName);
  return fs.readFileSync(filePath, 'utf-8');
}
