import { listPassesByOwner, PassData } from './aptos'
import { getFreeUsageForToday } from './usage'

export type AccessTier = 'FREE' | 'ONE_GURU' | 'ALL_GURUS'

export interface EffectiveAccess {
  tier: AccessTier
  guruSlug?: string
  expiresAt?: string
  freeChatsUsed?: number
  freeChatsRemaining?: number
}

export async function deriveEffectiveTier(params: {
  owner: string
}): Promise<EffectiveAccess> {
  const { owner } = params
  
  try {
    // Get all access passes for the user
    const passes = await listPassesByOwner(owner)
    
    // Filter for valid (non-expired) passes
    const validPasses = passes.filter(pass => !pass.isExpired)
    
    // Check for ALL_GURUS pass first (highest priority)
    const allGurusPass = validPasses.find(pass => 
      pass.properties.tier === 'ALL_GURUS'
    )
    
    if (allGurusPass) {
      return {
        tier: 'ALL_GURUS',
        expiresAt: allGurusPass.properties.expires_at,
      }
    }
    
    // Check for ONE_GURU pass
    const oneGuruPass = validPasses.find(pass => 
      pass.properties.tier === 'ONE_GURU'
    )
    
    if (oneGuruPass) {
      return {
        tier: 'ONE_GURU',
        guruSlug: oneGuruPass.properties.guru_slug,
        expiresAt: oneGuruPass.properties.expires_at,
      }
    }
    
    // Default to FREE tier
    const freeUsage = await getFreeUsageForToday(owner)
    const freeLimit = parseInt(process.env.NEXT_PUBLIC_FREE_CHATS_PER_DAY || '3')
    
    return {
      tier: 'FREE',
      freeChatsUsed: freeUsage,
      freeChatsRemaining: Math.max(0, freeLimit - freeUsage),
    }
    
  } catch (error) {
    console.error('Failed to derive effective tier:', error)
    
    // Fallback to FREE tier with default usage
    return {
      tier: 'FREE',
      freeChatsUsed: 0,
      freeChatsRemaining: parseInt(process.env.NEXT_PUBLIC_FREE_CHATS_PER_DAY || '3'),
    }
  }
}

export function canAccessGuru(access: EffectiveAccess, guruSlug: string): boolean {
  switch (access.tier) {
    case 'ALL_GURUS':
      return true
    case 'ONE_GURU':
      return access.guruSlug === guruSlug
    case 'FREE':
      // FREE tier can only access the general "astro-chatbot" persona
      return guruSlug === 'astro-chatbot'
    default:
      return false
  }
}

export function canStartNewChat(access: EffectiveAccess): boolean {
  switch (access.tier) {
    case 'ALL_GURUS':
    case 'ONE_GURU':
      return true
    case 'FREE':
      return (access.freeChatsRemaining || 0) > 0
    default:
      return false
  }
}

export function getAccessDescription(access: EffectiveAccess): string {
  switch (access.tier) {
    case 'ALL_GURUS':
      return `Unlimited access to all gurus until ${new Date(access.expiresAt!).toLocaleString()}`
    case 'ONE_GURU':
      return `Unlimited access to ${access.guruSlug} until ${new Date(access.expiresAt!).toLocaleString()}`
    case 'FREE':
      return `${access.freeChatsRemaining} free chats remaining today`
    default:
      return 'No access'
  }
}

export function getUpgradeOptions(access: EffectiveAccess): Array<{
  tier: 'ONE_GURU' | 'ALL_GURUS'
  title: string
  description: string
  price: string
}> {
  const oneGuruPrice = process.env.NEXT_PUBLIC_PRICE_ONE_GURU_APT || '0.20'
  const allGurusPrice = process.env.NEXT_PUBLIC_PRICE_ALL_GURUS_APT || '0.50'
  
  const options = []
  
  if (access.tier === 'FREE') {
    options.push({
      tier: 'ONE_GURU' as const,
      title: 'One Guru Day Pass',
      description: 'Unlimited chats with one chosen guru for 24 hours',
      price: `${oneGuruPrice} APT`,
    })
  }
  
  if (access.tier !== 'ALL_GURUS') {
    options.push({
      tier: 'ALL_GURUS' as const,
      title: 'All Gurus Day Pass',
      description: 'Unlimited chats with any guru for 24 hours',
      price: `${allGurusPrice} APT`,
    })
  }
  
  return options
}
