'use client'

import React, { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { WalletConnect } from '@/components/WalletConnect'
import { ReadingForm } from '@/components/ReadingForm'
import { ReadingCard } from '@/components/ReadingCard'
import { toast } from '@/components/Toast'
import { Sparkles, Shield, Zap, ExternalLink, Crown, Star } from 'lucide-react'

import { RawInputs, normalizeInputs, NormalizedInputs } from '@/lib/normalize'
import { generateReading, ReadingResponse } from '@/lib/ai'
import { sessionHash, reportHash, generateSessionId } from '@/lib/hash'
import { uploadEncrypted } from '@/lib/storage'
import { mintProofToken, getExplorerUrl } from '@/lib/aptos'
import { Account } from '@aptos-labs/ts-sdk'

interface AppState {
  step: 'form' | 'reading' | 'complete'
  inputs?: NormalizedInputs
  reading?: ReadingResponse
  sessionId?: string
  saving: boolean
  saved: boolean
  savedUri?: string
  minting: boolean
  minted: boolean
  mintTxHash?: string
}

export default function HomePage() {
  const { connected, account } = useWallet()
  const [state, setState] = useState<AppState>({
    step: 'form',
    saving: false,
    saved: false,
    minting: false,
    minted: false,
  })

  const handleGenerateReading = async (rawInputs: RawInputs) => {
    try {
      setState(prev => ({ ...prev, saving: true }))
      
      // Normalize inputs
      const inputs = normalizeInputs(rawInputs)
      
      // Generate reading
      const reading = await generateReading(inputs)
      
      // Generate session ID
      const sessionId = generateSessionId()
      
      setState(prev => ({
        ...prev,
        step: 'reading',
        inputs,
        reading,
        sessionId,
        saving: false,
      }))
      
    } catch (error) {
      console.error('Failed to generate reading:', error)
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate reading. Please try again.',
        variant: 'destructive',
      })
      setState(prev => ({ ...prev, saving: false }))
    }
  }

  const handleSaveReading = async (passphrase: string) => {
    if (!state.inputs || !state.reading || !state.sessionId || !account) {
      return
    }

    try {
      setState(prev => ({ ...prev, saving: true }))

      // Create report data
      const reportData = {
        version: '1.0',
        createdAt: new Date().toISOString(),
        model: state.reading.model,
        normalizedInputs: state.inputs,
        reading: state.reading.content,
        hashes: {
          session_hash: sessionHash(state.inputs),
          report_hash: reportHash(state.reading.content),
        },
      }

      // Upload encrypted report
      const uri = await uploadEncrypted(
        reportData,
        passphrase,
        account.address,
        state.sessionId
      )

      setState(prev => ({
        ...prev,
        saving: false,
        saved: true,
        savedUri: uri,
      }))

      toast({
        title: 'Reading Saved',
        description: 'Your reading has been encrypted and saved securely.',
      })

    } catch (error) {
      console.error('Failed to save reading:', error)
      toast({
        title: 'Save Failed',
        description: 'Failed to save reading. Please try again.',
        variant: 'destructive',
      })
      setState(prev => ({ ...prev, saving: false }))
    }
  }

  const handleMintProof = async () => {
    if (!state.inputs || !state.reading || !state.savedUri || !account) {
      return
    }

    try {
      setState(prev => ({ ...prev, minting: true }))

      const sHash = sessionHash(state.inputs)
      const rHash = reportHash(state.reading.content)
      const createdAt = new Date().toISOString()

      // For demo mode, create a mock account object
      const accountObj = {
        accountAddress: account.address,
        publicKey: account.publicKey,
        // In production, this would be the actual Account object from wallet adapter
      } as any

      const txHash = await mintProofToken(accountObj, {
        name: `AstroProof Reading ${sHash.slice(0, 8)}`,
        description: 'AI astrology reading with cryptographic verification',
        uri: state.savedUri,
        sessionHash: sHash,
        reportHash: rHash,
        createdAt,
      })

      setState(prev => ({
        ...prev,
        minting: false,
        minted: true,
        mintTxHash: txHash,
        step: 'complete',
      }))

      toast({
        title: 'NFT Minted',
        description: 'Your proof has been minted on Aptos blockchain.',
      })

    } catch (error) {
      console.error('Failed to mint NFT:', error)
      toast({
        title: 'Mint Failed',
        description: 'Failed to mint NFT. Please try again.',
        variant: 'destructive',
      })
      setState(prev => ({ ...prev, minting: false }))
    }
  }

  const resetToForm = () => {
    setState({
      step: 'form',
      saving: false,
      saved: false,
      minting: false,
      minted: false,
    })
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements - Responsive */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 royal-gradient rounded-full opacity-20 animate-royal-float blur-3xl" />
          <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-royal-blue/20 to-royal-purple/20 rounded-full opacity-30 animate-royal-float blur-2xl" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-10 sm:bottom-20 left-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-r from-royal-gold/10 to-royal-purple/10 rounded-full opacity-40 animate-royal-float blur-xl" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">
          {/* Hero Header */}
          <div className="text-center mb-8 sm:mb-16 animate-royal-slide-in">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
              <div className="relative">
                <div className="w-16 sm:w-20 h-16 sm:h-20 royal-gradient rounded-full flex items-center justify-center animate-royal-glow">
                  <Sparkles className="h-8 sm:h-10 w-8 sm:w-10 text-white animate-royal-pulse" />
                </div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-6 h-4 sm:h-6 bg-royal-gold rounded-full animate-royal-breathe" />
                <div className="absolute -bottom-1 sm:-bottom-2 -left-1 sm:-left-2 w-3 sm:w-4 h-3 sm:h-4 bg-royal-blue rounded-full animate-royal-pulse" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold royal-gradient-text mb-2 tracking-tight">
                  Astroblock
                </h1>
                <div className="text-royal-silver text-xs sm:text-sm font-medium tracking-wider">
                  <span className="royal-text-shine">✨ Crafted by Claude ✨</span>
                </div>
              </div>
            </div>
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 animate-royal-fade-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-xl sm:text-2xl md:text-3xl text-royal-silver mb-3 sm:mb-4 royal-text-glow px-4">
                AI Astrology Readings with <span className="royal-gradient-text font-semibold">Blockchain Verification</span>
              </p>
              <p className="text-base sm:text-lg text-royal-silver/80 max-w-2xl mx-auto leading-relaxed px-4">
                Experience the future of astrology with our premium AI-powered readings, 
                secured by cryptographic proof on the Aptos blockchain with Astroblock.
              </p>
            </div>
            <div className="royal-card max-w-3xl mx-auto p-4 sm:p-6 mb-6 sm:mb-8 animate-royal-fade-in mx-4" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 text-royal-gold">
                <Shield className="h-4 sm:h-5 w-4 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium text-center">
                  🔒 Public proof, private details • Only anonymous fingerprints go on-chain
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions - Responsive */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-16 animate-royal-slide-in px-4" style={{ animationDelay: '0.9s' }}>
            <Link href="/chat" className="w-full sm:w-auto">
              <Button className="royal-button w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link href="/gurus" className="w-full sm:w-auto">
              <Button className="royal-button-gold w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <Crown className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Browse Gurus
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button variant="outline" className="royal-card border-royal-purple/30 hover:border-royal-gold/50 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <Star className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                Pricing
              </Button>
            </Link>
          </div>

          {/* Wallet Connection - Responsive */}
          <div className="max-w-2xl mx-auto mb-8 sm:mb-16 animate-royal-fade-in px-4" style={{ animationDelay: '1.2s' }}>
            <div className="royal-card p-4 sm:p-6 text-center">
              <h3 className="text-lg sm:text-xl font-semibold royal-gradient-text mb-3 sm:mb-4">Connect Your Wallet</h3>
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>

      {/* Main Application Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {state.step === 'form' && (
            <div className="animate-royal-slide-in">
              <ReadingForm
                onSubmit={handleGenerateReading}
                loading={state.saving}
              />
            </div>
          )}

          {state.step === 'reading' && state.inputs && state.reading && (
            <div className="animate-royal-fade-in">
              <ReadingCard
                inputs={state.inputs}
                reading={state.reading}
                onSave={handleSaveReading}
                onMint={handleMintProof}
                canSave={connected && !state.saved}
                canMint={connected && state.saved && !state.minted}
                saving={state.saving}
                minting={state.minting}
                saved={state.saved}
                minted={state.minted}
              />
            </div>
          )}

          {state.step === 'complete' && state.mintTxHash && (
            <Card className="royal-card animate-royal-slide-in">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl royal-gradient-text mb-4">
                  ✨ Reading Complete! ✨
                </CardTitle>
                <div className="w-16 h-16 royal-gradient rounded-full flex items-center justify-center mx-auto animate-royal-glow">
                  <Sparkles className="h-8 w-8 text-white animate-royal-pulse" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-royal-silver mb-6 leading-relaxed">
                    Your astrology reading has been generated, encrypted, and proven on-chain!
                  </p>
                  
                  <div className="royal-card p-4 mb-6">
                    <a
                      href={getExplorerUrl(state.mintTxHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 royal-button px-6 py-3 rounded-lg transition-all duration-300"
                    >
                      <span>View on Aptos Explorer</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={resetToForm}
                    variant="outline"
                    className="royal-card border-royal-purple/30 hover:border-royal-gold/50 py-3"
                  >
                    ✨ New Reading
                  </Button>
                  <Link href="/me">
                    <Button className="w-full royal-button-gold py-3">
                      👑 View My Proofs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Premium Features Section - Responsive */}
        <div className="max-w-6xl mx-auto mt-12 sm:mt-24 px-4">
          <div className="text-center mb-8 sm:mb-16 animate-royal-slide-in">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold royal-gradient-text mb-3 sm:mb-4">
              Premium Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-royal-silver max-w-2xl mx-auto px-4">
              Experience the most advanced astrology platform with enterprise-grade security
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="royal-card group animate-royal-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 royal-gradient rounded-full flex items-center justify-center mx-auto animate-royal-glow">
                    <Shield className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-royal-emerald rounded-full animate-royal-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold royal-gradient-text mb-2 sm:mb-3">Private & Secure</h3>
                <p className="text-sm sm:text-base text-royal-silver/80 leading-relaxed">
                  Military-grade encryption protects your personal data. 
                  Client-side encryption ensures only you hold the keys.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card group animate-royal-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 royal-gradient rounded-full flex items-center justify-center mx-auto animate-royal-glow">
                    <Zap className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-royal-blue rounded-full animate-royal-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold royal-gradient-text mb-2 sm:mb-3">Blockchain Verified</h3>
                <p className="text-sm sm:text-base text-royal-silver/80 leading-relaxed">
                  Immutable proof of authenticity on Aptos blockchain. 
                  Verify readings publicly while keeping details private.
                </p>
              </CardContent>
            </Card>

            <Card className="royal-card group animate-royal-fade-in sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 royal-gradient rounded-full flex items-center justify-center mx-auto animate-royal-glow">
                    <Sparkles className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 bg-royal-gold rounded-full animate-royal-pulse" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold royal-gradient-text mb-2 sm:mb-3">AI Powered</h3>
                <p className="text-sm sm:text-base text-royal-silver/80 leading-relaxed">
                  Advanced AI models trained on centuries of astrological wisdom. 
                  Personalized insights with deterministic fallbacks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action - Responsive */}
        <div className="max-w-4xl mx-auto mt-12 sm:mt-24 text-center animate-royal-slide-in px-4">
          <div className="royal-card p-6 sm:p-8 lg:p-12">
            <h3 className="text-2xl sm:text-3xl font-bold royal-gradient-text mb-4 sm:mb-6">
              Ready to Experience the Future?
            </h3>
            <p className="text-base sm:text-lg lg:text-xl text-royal-silver mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who trust Astroblock for their spiritual journey. 
              Built by Claude with cutting-edge technology and royal elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button className="royal-button-gold w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                  <Crown className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" className="royal-card border-royal-purple/30 hover:border-royal-gold/50 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Brand Footer - Responsive */}
        <div className="text-center mt-8 sm:mt-16 animate-royal-fade-in px-4">
          <div className="royal-card p-4 sm:p-6 max-w-2xl mx-auto">
            <p className="text-royal-silver/80 text-xs sm:text-sm leading-relaxed">
              <span className="royal-text-shine">✨ Masterfully crafted by Claude ✨</span><br />
              <span className="block sm:inline">Built on Aptos • Encrypted with Web Crypto API • Powered by Advanced AI</span><br />
              <span className="text-royal-gold/80">For entertainment purposes only. Not medical, legal, or financial advice.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
