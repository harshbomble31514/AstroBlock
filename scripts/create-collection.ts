#!/usr/bin/env tsx

import { config } from 'dotenv'
import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'

// Load environment variables
config()

const NETWORK = (process.env.NEXT_PUBLIC_APTOS_NETWORK as Network) || Network.TESTNET
const COLLECTION_NAME = process.env.NEXT_PUBLIC_COLLECTION_NAME || 'AstroProofs'
const PASS_COLLECTION = process.env.NEXT_PUBLIC_PASS_COLLECTION || 'AstroPasses'

async function createCollections() {
  console.log('🌟 AstroProof Collection Creator')
  console.log('================================')
  console.log(`Network: ${NETWORK}`)
  console.log(`Reading Proofs Collection: ${COLLECTION_NAME}`)
  console.log(`Access Passes Collection: ${PASS_COLLECTION}`)
  console.log('')

  // Initialize Aptos client
  const config = new AptosConfig({ network: NETWORK })
  const aptos = new Aptos(config)

  // Check if private key is provided
  const privateKeyHex = process.env.APTOS_PRIVATE_KEY
  if (!privateKeyHex) {
    console.error('❌ Error: APTOS_PRIVATE_KEY environment variable is required')
    console.log('')
    console.log('To create a collection, you need to provide a private key for the creator account.')
    console.log('Set the APTOS_PRIVATE_KEY environment variable with your account private key.')
    console.log('')
    console.log('⚠️  SECURITY WARNING: Never commit private keys to version control!')
    console.log('Use a .env.local file or environment variables for sensitive data.')
    process.exit(1)
  }

  try {
    // Create account from private key
    const privateKey = new Ed25519PrivateKey(privateKeyHex)
    const account = Account.fromPrivateKey({ privateKey })
    
    console.log(`👤 Creator Address: ${account.accountAddress.toString()}`)
    
    // Check account balance
    try {
      const resources = await aptos.getAccountResources({
        accountAddress: account.accountAddress.toString(),
      })
      const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>')
      if (coinResource) {
        const balance = (coinResource.data as any).coin.value
        console.log(`💰 Account Balance: ${balance} APT`)
        
        if (parseInt(balance) < 100000) { // Less than 0.001 APT
          console.log('⚠️  Warning: Low balance. You may need more APT for gas fees.')
          if (NETWORK === Network.TESTNET) {
            console.log('Get testnet APT from: https://aptoslabs.com/testnet-faucet')
          }
        }
      }
    } catch (e) {
      console.log('⚠️  Could not check account balance')
    }

    console.log('')
    console.log('🔍 Checking if collections already exist...')

    // Check if collections already exist
    let proofsExists = false
    let passesExists = false
    
    // For demo mode, skip collection existence check
    console.log('⚠️  Demo mode: Skipping collection existence check')
    console.log('Creating collections (will fail if they already exist)')
    
    try {
      // In production, you would check if collections exist first
      // const collections = await aptos.getAccountCollections({
      //   accountAddress: account.accountAddress.toString(),
      // })
      // 
      // proofsExists = collections.some(c => c.collection_name === COLLECTION_NAME)
      // passesExists = collections.some(c => c.collection_name === PASS_COLLECTION)
    } catch (error) {
      // Collections don't exist or error checking, proceed with creation
    }

    // Create AstroProofs collection if it doesn't exist
    if (!proofsExists) {
      console.log(`📝 Creating collection "${COLLECTION_NAME}"...`)

      const proofsTransaction = await aptos.createCollectionTransaction({
        creator: account,
        description: 'AstroProof: AI astrology readings with cryptographic verification on Aptos blockchain. Public proof, private details. Each NFT represents a verified astrology reading with immutable proof of authenticity.',
        name: COLLECTION_NAME,
        uri: 'https://astroproof.app/collection',
        maxSupply: 1000000, // 1 million max supply
      })

      console.log('📤 Submitting AstroProofs transaction...')
      
      const proofsResponse = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: proofsTransaction,
      })

      console.log(`🔄 AstroProofs Transaction Hash: ${proofsResponse.hash}`)
      console.log('⏳ Waiting for confirmation...')

      const proofsResult = await aptos.waitForTransaction({ 
        transactionHash: proofsResponse.hash,
        options: {
          timeoutSecs: 30,
        }
      })

      if (proofsResult.success) {
        console.log(`✅ ${COLLECTION_NAME} collection created successfully!`)
      } else {
        console.error(`❌ ${COLLECTION_NAME} transaction failed!`)
        console.error('Transaction result:', proofsResult)
        return
      }
    }

    // Create AstroPasses collection if it doesn't exist
    if (!passesExists) {
      console.log(`📝 Creating collection "${PASS_COLLECTION}"...`)

      const passesTransaction = await aptos.createCollectionTransaction({
        creator: account,
        description: 'AstroProof Access Passes: Time-limited access tokens for premium guru consultations and unlimited chat sessions. Each pass grants special access to spiritual guidance.',
        name: PASS_COLLECTION,
        uri: 'https://astroproof.app/passes',
        maxSupply: 100000, // 100k max supply
      })

      console.log('📤 Submitting AstroPasses transaction...')
      
      const passesResponse = await aptos.signAndSubmitTransaction({
        signer: account,
        transaction: passesTransaction,
      })

      console.log(`🔄 AstroPasses Transaction Hash: ${passesResponse.hash}`)
      console.log('⏳ Waiting for confirmation...')

      const passesResult = await aptos.waitForTransaction({ 
        transactionHash: passesResponse.hash,
        options: {
          timeoutSecs: 30,
        }
      })

      if (passesResult.success) {
        console.log(`✅ ${PASS_COLLECTION} collection created successfully!`)
      } else {
        console.error(`❌ ${PASS_COLLECTION} transaction failed!`)
        console.error('Transaction result:', passesResult)
        return
      }
    }

    console.log('')
    console.log('🎉 SUCCESS! All collections are ready!')
    console.log('')
    console.log('Collection Details:')
    console.log(`   📚 ${COLLECTION_NAME}: Reading proofs and verifications`)
    console.log(`   🎫 ${PASS_COLLECTION}: Access passes for premium features`)
    console.log(`   Creator: ${account.accountAddress.toString()}`)
    console.log('')
    console.log('✅ You can now run the AstroProof application!')
    console.log('   Run: pnpm dev')

  } catch (error) {
    console.error('❌ Error creating collection:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('INSUFFICIENT_BALANCE')) {
        console.log('')
        console.log('💡 Insufficient balance for gas fees.')
        if (NETWORK === Network.TESTNET) {
          console.log('Get testnet APT from: https://aptoslabs.com/testnet-faucet')
        }
      } else if (error.message.includes('SEQUENCE_NUMBER')) {
        console.log('')
        console.log('💡 Transaction sequence error. Please try again.')
      }
    }
    
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  createCollections().catch(console.error)
}

export { createCollections }
