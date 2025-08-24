import { format, formatDistanceToNow } from 'date-fns'

export function maskAddress(address: string, chars: number = 6): string {
  if (!address) return ''
  if (address.length <= chars * 2) return address
  
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM dd, yyyy')
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return format(d, 'MMM dd, yyyy at h:mm a')
}

export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatBirthInfo(dob: string, time: string, place: string): string {
  const date = new Date(dob)
  const formattedDate = format(date, 'MMMM dd, yyyy')
  return `Born ${formattedDate} at ${time} in ${place}`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getShareText(readingPreview: string): string {
  const preview = truncateText(readingPreview, 120)
  return `${preview}\n\nVerify this astrology reading on Aptos blockchain:`
}

export function formatHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-8)}`
}

export function validateWalletAddress(address: string): boolean {
  // Basic Aptos address validation
  const cleanAddress = address.replace('0x', '')
  return /^[a-fA-F0-9]{64}$/.test(cleanAddress) || /^[a-fA-F0-9]{40}$/.test(cleanAddress)
}
