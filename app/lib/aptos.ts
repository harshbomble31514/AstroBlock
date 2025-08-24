import {
  Aptos,
  AptosConfig,
  Network,
  Account,
  Ed25519PrivateKey,
  AccountAddress,
} from '@aptos-labs/ts-sdk'
import { NormalizedInputs } from './normalize'

const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTION_NAME || 'AstroProofs'
const PASS_COLLECTION = process.env.NEXT_PUBLIC_PASS_COLLECTION || 'AstroPasses'
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || 'web-mvp-1.0'
const NETWORK = (process.env.NEXT_PUBLIC_APTOS_NETWORK as Network) || Network.TESTNET
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''

// Initialize Aptos client
const config = new AptosConfig({ network: NETWORK })
const aptos = new Aptos(config)

export { aptos }

export interface TokenData {
  tokenId: string
  owner: string
  collection: string
  name: string
  description: string
  uri: string
  properties: {
    session_hash: string
    report_hash: string
    created_at: string
    app_version: string
  }
  blockHeight?: string
  transactionHash?: string
}

export interface MintTokenParams {
  name: string
  description: string
  uri: string
  sessionHash: string
  reportHash: string
  createdAt: string
}

export async function getClient() {
  return aptos
}

export async function ensureCollectionExists(account: Account): Promise<void> {
  try {
    // For demo mode, we'll just try to create the collection
    // In production, you'd check if it exists first
    console.log('Demo mode: Skipping collection existence check')
    
    // Try to create collection (will fail if it already exists, which is fine)
    try {
      await createCollection(account)
    } catch (error: any) {
      // Collection might already exist, which is fine
      if (error.message?.includes('ECOLLECTION_ALREADY_EXISTS')) {
        console.log('Collection already exists')
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('Error checking/creating collection:', error)
    throw error
  }
}

export async function ensurePassCollectionExists(account: Account, name?: string): Promise<void> {
  const collectionName = name || PASS_COLLECTION
  
  try {
    // For demo mode, we'll just try to create the collection
    // In production, you'd check if it exists first
    console.log('Demo mode: Skipping pass collection existence check')
    
    // Try to create collection (will fail if it already exists, which is fine)
    try {
      await createPassCollection(account, collectionName)
    } catch (error: any) {
      // Collection might already exist, which is fine
      if (error.message?.includes('ECOLLECTION_ALREADY_EXISTS')) {
        console.log('Pass collection already exists')
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('Error checking/creating pass collection:', error)
    throw error
  }
}

export async function createCollection(account: Account): Promise<string> {
  try {
    const transaction = await aptos.createCollectionTransaction({
      creator: account,
      description: 'AstroProof: AI astrology readings with cryptographic verification on Aptos blockchain. Public proof, private details.',
      name: COLLECTION_NAME,
      uri: 'https://astroproof.app/collection',
      maxSupply: 1000000,
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to create collection:', error)
    throw error
  }
}

export async function createPassCollection(account: Account, collectionName: string): Promise<string> {
  try {
    const transaction = await aptos.createCollectionTransaction({
      creator: account,
      description: 'AstroProof Access Passes: Time-limited access tokens for premium guru consultations and unlimited chat sessions.',
      name: collectionName,
      uri: 'https://astroproof.app/passes',
      maxSupply: 100000,
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to create pass collection:', error)
    throw error
  }
}

export async function mintProofToken(
  account: Account,
  params: MintTokenParams
): Promise<string> {
  try {
    await ensureCollectionExists(account)

    const transaction = await aptos.mintDigitalAssetTransaction({
      creator: account,
      collection: COLLECTION_NAME,
      description: params.description,
      name: params.name,
      uri: params.uri,
      propertyKeys: ['session_hash', 'report_hash', 'created_at', 'app_version'],
      propertyTypes: ['STRING', 'STRING', 'STRING', 'STRING'],
      propertyValues: [
        params.sessionHash,
        params.reportHash,
        params.createdAt,
        APP_VERSION,
      ],
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to mint token:', error)
    throw error
  }
}

export async function readToken(tokenId: string): Promise<TokenData | null> {
  try {
    const digitalAsset = await aptos.getDigitalAssetData({
      digitalAssetAddress: tokenId,
    })

    if (!digitalAsset) return null

    // For demo mode, skip transaction info fetching
    let blockHeight: string | undefined
    let transactionHash: string | undefined
    
    // In production, you would fetch the actual transaction info
    console.log('Demo mode: Skipping transaction info fetch')

    const tokenData: TokenData = {
      tokenId,
      owner: (digitalAsset as any).owner_address || '',
      collection: (digitalAsset as any).collection_id || '',
      name: (digitalAsset as any).token_name || '',
      description: (digitalAsset as any).description || '',
      uri: (digitalAsset as any).token_uri || '',
      properties: {
        session_hash: (digitalAsset as any).token_properties?.session_hash || '',
        report_hash: (digitalAsset as any).token_properties?.report_hash || '',
        created_at: (digitalAsset as any).token_properties?.created_at || '',
        app_version: (digitalAsset as any).token_properties?.app_version || '',
      },
      blockHeight,
      transactionHash,
    }

    return tokenData
  } catch (error) {
    console.error('Failed to read token:', error)
    return null
  }
}

export async function listMyTokens(ownerAddress: string): Promise<TokenData[]> {
  try {
    // For demo mode, return empty array
    // In production, this would fetch real tokens from the blockchain
    console.log('Demo mode: listMyTokens returning empty array for', ownerAddress)
    return []
  } catch (error) {
    console.error('Failed to list tokens:', error)
    return []
  }
}

export function getExplorerUrl(txHash: string): string {
  const baseUrl = NETWORK === Network.MAINNET 
    ? 'https://explorer.aptoslabs.com'
    : 'https://explorer.aptoslabs.com/testnet'
  return `${baseUrl}/txn/${txHash}`
}

export function getTokenUrl(tokenId: string): string {
  const baseUrl = NETWORK === Network.MAINNET 
    ? 'https://explorer.aptoslabs.com'
    : 'https://explorer.aptoslabs.com/testnet'
  return `${baseUrl}/object/${tokenId}`
}

// Payment Functions
export async function transferAPT(params: {
  from: Account
  to: string
  amountApt: string
}): Promise<string> {
  try {
    const { from, to, amountApt } = params
    
    // Convert APT to octas (1 APT = 100,000,000 octas)
    const amountOctas = Math.floor(parseFloat(amountApt) * 100_000_000)
    
    const transaction = await aptos.transferCoinTransaction({
      sender: from.accountAddress,
      recipient: to,
      amount: amountOctas,
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: from,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to transfer APT:', error)
    throw error
  }
}

// Access Pass Functions
export interface AccessPassParams {
  recipient: string
  tier: 'ONE_GURU' | 'ALL_GURUS'
  guruSlug: string
  issuedAt: string
  expiresAt: string
}

export async function mintAccessPass(
  account: Account,
  params: AccessPassParams
): Promise<string> {
  try {
    await ensurePassCollectionExists(account)

    const passName = params.tier === 'ONE_GURU' 
      ? `${params.guruSlug} Day Pass`
      : 'All Gurus Day Pass'

    const transaction = await aptos.mintDigitalAssetTransaction({
      creator: account,
      collection: PASS_COLLECTION,
      description: `AstroProof ${passName} - Premium access to guru consultations`,
      name: passName,
      uri: `https://astroproof.app/passes/${params.tier.toLowerCase()}`,
      propertyKeys: ['tier', 'guru_slug', 'issued_at', 'expires_at', 'app_version'],
      propertyTypes: ['STRING', 'STRING', 'STRING', 'STRING', 'STRING'],
      propertyValues: [
        params.tier,
        params.guruSlug,
        params.issuedAt,
        params.expiresAt,
        APP_VERSION,
      ],
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to mint access pass:', error)
    throw error
  }
}

export interface PassData {
  tokenId: string
  owner: string
  collection: string
  name: string
  description: string
  uri: string
  properties: {
    tier: string
    guru_slug: string
    issued_at: string
    expires_at: string
    app_version: string
  }
  isExpired: boolean
}

export async function listPassesByOwner(ownerAddress: string): Promise<PassData[]> {
  try {
    // For demo mode, return empty array
    // In production, this would fetch real access passes from the blockchain
    console.log('Demo mode: listPassesByOwner returning empty array for', ownerAddress)
    return []
  } catch (error) {
    console.error('Failed to list passes:', error)
    return []
  }
}

export async function getTxnInfo(txHash: string) {
  try {
    const transaction = await aptos.getTransactionByHash({ transactionHash: txHash })
    return transaction
  } catch (error) {
    console.error('Failed to get transaction info:', error)
    return null
  }
}

// ===== MOVE CONTRACT INTEGRATION =====

/// Create a reading proof using Move contract
export async function createReadingProofWithContract(
  account: Account,
  params: {
    sessionHash: string
    reportHash: string
    encryptedUri: string
    name: string
    description: string
  }
): Promise<string> {
  if (!CONTRACT_ADDRESS) {
    throw new Error('CONTRACT_ADDRESS not configured. Please deploy Move contracts first.')
  }

  try {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::astroproof::create_reading_proof`,
        typeArguments: [],
        functionArguments: [
          params.sessionHash,
          params.reportHash,
          params.encryptedUri,
          params.name,
          params.description
        ]
      }
    })

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    })

    await aptos.waitForTransaction({ transactionHash: response.hash })
    return response.hash
  } catch (error) {
    console.error('Failed to create reading proof with Move contract:', error)
    throw error
  }
}

/// Verify a reading using Move contract
export async function verifyReadingWithContract(
  verifier: Account,
  tokenAddress: string,
  expectedSessionHash: string,
  expectedReportHash: string
): Promise<boolean> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode verification.')
    // Demo mode: simulate verification
    return expectedSessionHash.length === 64 && expectedReportHash.length === 64
  }

  try {
    // For demo, return true if hashes are valid format
    console.log('Demo mode: Simulating Move contract verification')
    return expectedSessionHash.length === 64 && expectedReportHash.length === 64
  } catch (error) {
    console.error('Failed to verify reading with Move contract:', error)
    return false
  }
}

/// Purchase One Guru Pass using Move contract
export async function purchaseOneGuruPassWithContract(
  buyer: Account,
  guruSlug: string
): Promise<string> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    // Demo mode: return a mock transaction hash
    return `demo_pass_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  try {
    // For demo, simulate purchase
    console.log('Demo mode: Simulating Move contract pass purchase for', guruSlug)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
    return `demo_pass_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  } catch (error) {
    console.error('Failed to purchase One Guru Pass with Move contract:', error)
    throw error
  }
}

/// Purchase All Gurus Pass using Move contract
export async function purchaseAllGurusPassWithContract(
  buyer: Account
): Promise<string> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    return `demo_all_pass_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  try {
    // For demo, simulate purchase
    console.log('Demo mode: Simulating Move contract all gurus pass purchase')
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate transaction time
    return `demo_all_pass_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  } catch (error) {
    console.error('Failed to purchase All Gurus Pass with Move contract:', error)
    throw error
  }
}

/// Check if user has guru access using Move contract
export async function checkGuruAccessWithContract(
  userAddress: string,
  guruSlug: string,
  passAddresses: string[]
): Promise<boolean> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    // Demo mode: allow access to astro-chatbot for everyone
    return guruSlug === 'astro-chatbot'
  }

  try {
    // For demo, simulate access check
    console.log('Demo mode: Simulating Move contract access check for', guruSlug)
    return guruSlug === 'astro-chatbot' || passAddresses.length > 0
  } catch (error) {
    console.error('Failed to check guru access with Move contract:', error)
    return false
  }
}

/// Get reading proof data from Move contract
export async function getReadingProofFromContract(
  tokenAddress: string
): Promise<{
  sessionHash: string
  reportHash: string
  createdAt: number
  encryptedUri: string
  appVersion: string
  owner: string
} | null> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    return null
  }

  try {
    // For demo, return mock data
    console.log('Demo mode: Simulating Move contract reading proof fetch')
    return {
      sessionHash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      reportHash: 'fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
      createdAt: Date.now(),
      encryptedUri: 'https://demo.storage.com/encrypted/reading',
      appVersion: 'web-mvp-1.0',
      owner: tokenAddress,
    }
  } catch (error) {
    console.error('Failed to get reading proof from Move contract:', error)
    return null
  }
}

/// Get total readings count from Move contract
export async function getTotalReadingsFromContract(): Promise<number> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    return 42 // Demo value
  }

  try {
    // For demo, return a mock count
    console.log('Demo mode: Simulating Move contract total readings count')
    return Math.floor(Math.random() * 100) + 50 // Random demo count
  } catch (error) {
    console.error('Failed to get total readings from Move contract:', error)
    return 0
  }
}

/// Process payment using Move contract treasury
export async function processPaymentWithContract(
  payer: Account,
  amount: number,
  purpose: string,
  metadata: string = ''
): Promise<number> {
  if (!CONTRACT_ADDRESS) {
    console.warn('CONTRACT_ADDRESS not configured. Using demo mode.')
    // Demo mode: simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    return Date.now()
  }

  try {
    // For demo, simulate payment
    console.log('Demo mode: Simulating Move contract payment processing')
    console.log(`Amount: ${amount} APT, Purpose: ${purpose}`)
    await new Promise(resolve => setTimeout(resolve, 2000))
    return Date.now()
  } catch (error) {
    console.error('Failed to process payment with Move contract:', error)
    throw error
  }
}

/// Check if Move contracts are deployed and configured
export function isContractConfigured(): boolean {
  return CONTRACT_ADDRESS !== ''
}

/// Get contract addresses for display
export function getContractInfo() {
  return {
    contractAddress: CONTRACT_ADDRESS,
    network: NETWORK,
    isConfigured: isContractConfigured()
  }
}
