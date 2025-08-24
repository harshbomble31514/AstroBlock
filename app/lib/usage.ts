// For demo mode, disable Firebase completely
const isFirebaseConfigured = false

function getTodayString(): string {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

export async function getFreeUsageForToday(wallet: string): Promise<number> {
  // Demo mode: return 0 usage (full free chats available)
  console.warn('Demo mode: Firebase not configured, returning 0 usage')
  return 0
}

export async function incrementFreeUsage(wallet: string): Promise<number> {
  // Demo mode: simulate increment but don't persist
  console.warn('Demo mode: Firebase not configured, simulating usage increment')
  return 1
}

export async function enforceFreeLimitOrThrow(wallet: string, limit?: number): Promise<void> {
  const freeLimit = limit || parseInt(process.env.NEXT_PUBLIC_FREE_CHATS_PER_DAY || '3')
  const currentUsage = await getFreeUsageForToday(wallet)
  
  if (currentUsage >= freeLimit) {
    throw new Error(`Daily free chat limit of ${freeLimit} reached. Please upgrade to continue.`)
  }
}

export async function canUseFreeChat(wallet: string): Promise<boolean> {
  try {
    const freeLimit = parseInt(process.env.NEXT_PUBLIC_FREE_CHATS_PER_DAY || '3')
    const currentUsage = await getFreeUsageForToday(wallet)
    return currentUsage < freeLimit
  } catch (error) {
    console.error('Failed to check free chat availability:', error)
    return false
  }
}

export async function resetDailyUsage(wallet: string): Promise<void> {
  // Demo mode: simulate reset but don't persist
  console.warn('Demo mode: Firebase not configured, simulating usage reset')
}
