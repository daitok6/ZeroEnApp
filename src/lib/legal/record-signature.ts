import { createHash } from 'crypto';
import { createClient } from '@/lib/supabase/server';
import type { LegalDocumentType } from './versions';

export interface SignatureRecord {
  userId: string;
  documentType: LegalDocumentType;
  documentVersion: string;
  documentBody: string;      // full markdown body the user saw
  signatureName: string;
  ipAddress: string;
  userAgent: string;
  locale: 'en' | 'ja';
}

/**
 * Record an immutable signing event.
 * Hashes the exact document body the user saw, then inserts into signed_documents.
 * Returns the new record's id, or throws on error.
 */
export async function recordSignature(record: SignatureRecord): Promise<string> {
  const sha256 = createHash('sha256').update(record.documentBody, 'utf8').digest('hex');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('signed_documents')
    .insert({
      user_id: record.userId,
      document_type: record.documentType === 'nda' ? 'nda' : 'partnership_agreement',
      document_version: record.documentVersion,
      document_sha256: sha256,
      document_body: record.documentBody,
      signature_name: record.signatureName,
      ip_address: record.ipAddress,
      user_agent: record.userAgent,
      locale: record.locale,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to record signature: ${error.message}`);
  }

  return data.id as string;
}
