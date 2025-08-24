import { encryptJSON, EncryptedPayload } from './crypto'

// For MVP demo, we'll disable Firebase to avoid build issues
const isFirebaseConfigured = false

export { isFirebaseConfigured }

export async function ensureAuthenticated(): Promise<void> {
  throw new Error('Firebase not configured - demo mode only')
}

export async function uploadEncrypted(
  reportData: any,
  passphrase: string,
  walletAddress: string,
  sessionId: string
): Promise<string> {
  throw new Error('Firebase storage not configured - demo mode only')
}

export async function downloadAndDecrypt(
  url: string,
  passphrase: string
): Promise<any> {
  throw new Error('Download/decrypt not available - demo mode only')
}

export function getFileUrl(path: string): string {
  return `demo://storage/${path}`
}
