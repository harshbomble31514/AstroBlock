'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MessageCircle, Crown, Star, AlertCircle, Lock } from 'lucide-react'
import { deriveEffectiveTier, canAccessGuru } from '@/lib/access'
import { CheckoutPass } from '@/components/CheckoutPass'
import type { EffectiveAccess } from '@/lib/access'

interface GuruAccessCheckProps {
  guruSlug: string
  guruName: string
}

export function GuruAccessCheck({ guruSlug, guruName }: GuruAccessCheckProps) {
  const { connected, account } = useWallet()
  const [access, setAccess] = useState<EffectiveAccess | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutTier, setCheckoutTier] = useState<'ONE_GURU' | 'ALL_GURUS'>('ONE_GURU')

  useEffect(() => {
    if (connected && account?.address) {
      loadAccess()
    }
  }, [connected, account])

  const loadAccess = async () => {
    if (!account?.address) return
    
    try {
      setLoading(true)
      const effectiveAccess = await deriveEffectiveTier({ owner: account.address })
      setAccess(effectiveAccess)
    } catch (error) {
      console.error('Failed to load access:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChatAccess = () => {
    if (!connected) {
      return
    }

    if (!access) {
      return
    }

    // Check if user can access this guru
    if (canAccessGuru(access, guruSlug)) {
      // Direct access - go to chat
      window.location.href = `/chat?guru=${guruSlug}`
      return
    }

    // Need to purchase access
    if (guruSlug === 'astro-chatbot') {
      // Free tier access
      if (access.freeChatsRemaining && access.freeChatsRemaining > 0) {
        window.location.href = `/chat?guru=${guruSlug}`
        return
      } else {
        // Show upgrade options
        setCheckoutTier('ONE_GURU')
        setShowCheckout(true)
        return
      }
    }

    // Premium guru - show purchase options
    setCheckoutTier('ONE_GURU')
    setShowCheckout(true)
  }

  const handleUpgradeToAll = () => {
    setCheckoutTier('ALL_GURUS')
    setShowCheckout(true)
  }

  if (!connected) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-amber-400" />
            <span className="text-amber-300">Connect Wallet to Access</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-200/80 mb-4">
            Connect your Aptos wallet to start chatting with {guruName} and purchase access passes.
          </p>
          <Link href="/">
            <Button className="w-full">
              Connect Wallet
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="astro-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking your access...</p>
        </CardContent>
      </Card>
    )
  }

  if (!access) {
    return (
      <Card className="border-red-500/20 bg-red-500/10">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
          <p className="text-red-300">Failed to load access information</p>
          <Button onClick={loadAccess} variant="outline" className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Check if user has access
  const hasAccess = canAccessGuru(access, guruSlug)

  if (hasAccess) {
    return (
      <Card className="border-green-500/20 bg-green-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-300">You Have Access!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-200/80">
            {access.tier === 'FREE' 
              ? `You have ${access.freeChatsRemaining} free chats remaining today with the Astro Chatbot.`
              : access.tier === 'ONE_GURU'
              ? `You have unlimited access to ${guruName} until ${new Date(access.expiresAt!).toLocaleString()}.`
              : `You have unlimited access to all gurus until ${new Date(access.expiresAt!).toLocaleString()}.`
            }
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={handleChatAccess}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Chatting with {guruName}
            </Button>
            
            {access.tier !== 'ALL_GURUS' && (
              <Button
                onClick={handleUpgradeToAll}
                variant="outline"
                className="w-full"
              >
                <Star className="mr-2 h-4 w-4" />
                Upgrade to All Gurus Access
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // User needs to purchase access
  if (guruSlug === 'astro-chatbot') {
    // Free tier but no chats remaining
    return (
      <Card className="border-amber-500/20 bg-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-amber-300">Daily Limit Reached</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-amber-200/80">
            You've used all {access.freeChatsUsed} free chats for today. 
            Upgrade to continue chatting with unlimited access.
          </p>
          
          <div className="space-y-2">
            <Button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="mr-2 h-4 w-4" />
              Get Unlimited Access
            </Button>
            
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                View All Pricing Options
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Premium guru access needed
  return (
    <Card className="border-purple-500/20 bg-purple-500/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-purple-400" />
          <span className="text-purple-300">Premium Access Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-purple-200/80">
          {guruName} is a premium guru specializing in ancient wisdom traditions. 
          Purchase a day pass to unlock unlimited consultations.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={() => {
              setCheckoutTier('ONE_GURU')
              setShowCheckout(true)
            }}
            variant="outline"
            className="border-purple-500/30"
          >
            <Crown className="mr-2 h-4 w-4" />
            {guruName} Pass
            <span className="ml-auto text-sm">
              {process.env.NEXT_PUBLIC_PRICE_ONE_GURU_APT || '0.20'} APT
            </span>
          </Button>
          
          <Button
            onClick={() => {
              setCheckoutTier('ALL_GURUS')
              setShowCheckout(true)
            }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Star className="mr-2 h-4 w-4" />
            All Gurus Pass
            <span className="ml-auto text-sm">
              {process.env.NEXT_PUBLIC_PRICE_ALL_GURUS_APT || '0.50'} APT
            </span>
          </Button>
        </div>
        
        <div className="text-center">
          <Link 
            href="/pricing"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Compare all pricing options →
          </Link>
        </div>
      </CardContent>
      
      {showCheckout && (
        <CheckoutPass
          tier={checkoutTier}
          guruSlug={checkoutTier === 'ONE_GURU' ? guruSlug : undefined}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false)
            loadAccess()
          }}
        />
      )}
    </Card>
  )
}
