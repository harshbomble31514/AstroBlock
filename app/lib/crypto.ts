export interface EncryptedPayload {
  ciphertext: string // base64
  iv: string // base64
  salt: string // base64
  algo: 'AES-GCM'
}

export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt?: Uint8Array
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const encoder = new TextEncoder()
  const passphraseBuffer = encoder.encode(passphrase)
  
  // Generate salt if not provided
  const actualSalt = salt || crypto.getRandomValues(new Uint8Array(16))
  
  // Import the passphrase as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passphraseBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  
  // Derive the actual encryption key
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: actualSalt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
  
  return { key, salt: actualSalt }
}

export async function encryptJSON(
  obj: any,
  passphrase: string
): Promise<EncryptedPayload> {
  const { key, salt } = await deriveKeyFromPassphrase(passphrase)
  
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(obj))
  
  const iv = crypto.getRandomValues(new Uint8Array(12))
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  )
  
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    algo: 'AES-GCM'
  }
}

export async function decryptJSON(
  payload: EncryptedPayload,
  passphrase: string
): Promise<any> {
  if (payload.algo !== 'AES-GCM') {
    throw new Error('Unsupported encryption algorithm')
  }
  
  const salt = base64ToArrayBuffer(payload.salt)
  const { key } = await deriveKeyFromPassphrase(passphrase, new Uint8Array(salt))
  
  const iv = base64ToArrayBuffer(payload.iv)
  const ciphertext = base64ToArrayBuffer(payload.ciphertext)
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    key,
    ciphertext
  )
  
  const decoder = new TextDecoder()
  const jsonString = decoder.decode(decrypted)
  
  return JSON.parse(jsonString)
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
