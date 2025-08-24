import { sha256 } from 'js-sha256'
import { NormalizedInputs, getStableInputsString } from './normalize'

export function sessionHash(inputs: NormalizedInputs): string {
  const stableString = getStableInputsString(inputs)
  return sha256(stableString)
}

export function reportHash(readingText: string): string {
  // Hash the plain reading text
  const cleaned = readingText.trim()
  return sha256(cleaned)
}

export function generateSessionId(): string {
  // Generate a random session ID for file naming
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}_${random}`
}
