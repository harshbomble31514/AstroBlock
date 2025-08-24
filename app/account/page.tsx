'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, User, Crown, Star, Clock, ExternalLink, MessageCircle, Calendar } from 'lucide-react'
import { deriveEffectiveTier } from '@/lib/access'
import { listPassesByOwner, getExplorerUrl } from '@/lib/aptos'
import { WalletConnect } from '@/components/WalletConnect'
import { CheckoutPass } from '@/components/CheckoutPass'
import { Spinner } from '@/components/Spinner'
import { maskAddress, formatDateTime } from '@/lib/format'
import type { EffectiveAccess } from '@/lib/access'
import type { PassData } from '@/lib/aptos'

export default function AccountPage() {
  const { connected, account } = useWallet()
  const [access, setAccess] = useState<EffectiveAccess | null>(null)
  const [passes, setPasses] = useState<PassData[]>([])
  const [loading, setLoading] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutTier, setCheckoutTier] = useState<'ONE_GURU' | 'ALL_GURUS'>('ONE_GURU')

  useEffect(() => {
    if (connected && account?.address) {
      loadAccountData()
    }
  }, [connected, account])

  const loadAccountData = async () => {
    if (!account?.address) return
    
    try {
      setLoading(true)
      
      // Load access and passes in parallel
      const [effectiveAccess, userPasses] = await Promise.all([
        deriveEffectiveTier({ owner: account.address }),
        listPassesByOwner(account.address)
      ])
      
      setAccess(effectiveAccess)
      setPasses(userPasses)
    } catch (error) {
      console.error('Failed to load account data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (tier: 'ONE_GURU' | 'ALL_GURUS') => {
    setCheckoutTier(tier)
    setShowCheckout(true)
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="astro-card text-center">
              <CardContent className="p-8">
                <User className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your Aptos wallet to view your account and access passes.
                </p>
                <WalletConnect />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              My Account
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Account Overview */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-400" />
                <span>Account Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Wallet Address
                  </label>
                  <p className="font-mono text-sm">
                    {maskAddress(account?.address || '')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Network
                  </label>
                  <p className="text-sm">
                    Aptos Testnet
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Access Status */}
          {loading ? (
            <Card className="astro-card">
              <CardContent className="p-8 text-center">
                <Spinner className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your access status...</p>
              </CardContent>
            </Card>
          ) : access ? (
            <Card className="astro-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {access.tier === 'FREE' && <MessageCircle className="h-5 w-5 text-blue-400" />}
                  {access.tier === 'ONE_GURU' && <Crown className="h-5 w-5 text-purple-400" />}
                  {access.tier === 'ALL_GURUS' && <Star className="h-5 w-5 text-yellow-400" />}
                  <span>Current Access Level</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge 
                      variant="outline"
                      className={`${
                        access.tier === 'FREE' ? 'border-blue-500/30 text-blue-300' :
                        access.tier === 'ONE_GURU' ? 'border-purple-500/30 text-purple-300' :
                        'border-yellow-500/30 text-yellow-300'
                      }`}
                    >
                      {access.tier === 'FREE' ? 'Free Tier' :
                       access.tier === 'ONE_GURU' ? 'One Guru Pass' :
                       'All Gurus Pass'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {access.tier === 'FREE' && 
                        `${access.freeChatsRemaining} free chats remaining today`}
                      {access.tier === 'ONE_GURU' && access.guruSlug &&
                        `Unlimited access to ${access.guruSlug} guru`}
                      {access.tier === 'ALL_GURUS' &&
                        'Unlimited access to all gurus'}
                    </p>
                    {access.expiresAt && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        <span>Expires {formatDateTime(access.expiresAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {access.tier !== 'ALL_GURUS' && (
                      <Button
                        onClick={() => handlePurchase('ALL_GURUS')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Upgrade to All Gurus
                      </Button>
                    )}
                    {access.tier === 'FREE' && (
                      <Button
                        onClick={() => handlePurchase('ONE_GURU')}
                        variant="outline"
                        className="w-full"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        Get One Guru Pass
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Access Passes */}
          <Card className="astro-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-purple-400" />
                <span>Your Access Passes</span>
              </CardTitle>
              {passes.length > 0 && (
                <Badge variant="outline">
                  {passes.length} pass{passes.length === 1 ? '' : 'es'}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <Spinner className="mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading your passes...</p>
                </div>
              ) : passes.length === 0 ? (
                <div className="text-center py-8">
                  <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Access Passes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Purchase day passes to unlock premium guru consultations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => handlePurchase('ONE_GURU')}
                      variant="outline"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Buy One Guru Pass
                    </Button>
                    <Button
                      onClick={() => handlePurchase('ALL_GURUS')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Buy All Gurus Pass
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {passes.map((pass) => (
                    <Card key={pass.tokenId} className="bg-muted/20 border-muted/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant="outline"
                                className={`${
                                  pass.properties.tier === 'ALL_GURUS'
                                    ? 'border-yellow-500/30 text-yellow-300'
                                    : 'border-purple-500/30 text-purple-300'
                                }`}
                              >
                                {pass.properties.tier === 'ALL_GURUS' ? 'All Gurus' : 'One Guru'}
                              </Badge>
                              {pass.isExpired && (
                                <Badge variant="destructive" className="text-xs">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            
                            <h4 className="font-semibold">{pass.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {pass.description}
                            </p>
                            
                            {pass.properties.guru_slug && (
                              <p className="text-sm text-muted-foreground mt-1">
                                Guru: {pass.properties.guru_slug}
                              </p>
                            )}
                            
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>Issued {formatDateTime(pass.properties.issued_at)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Expires {formatDateTime(pass.properties.expires_at)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <a
                              href={getExplorerUrl(pass.tokenId)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline">
                                <ExternalLink className="mr-2 h-3 w-3" />
                                View NFT
                              </Button>
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Purchase More */}
                  <div className="border-t border-muted/20 pt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={() => handlePurchase('ONE_GURU')}
                        variant="outline"
                        className="flex-1"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        Buy Another One Guru Pass
                      </Button>
                      <Button
                        onClick={() => handlePurchase('ALL_GURUS')}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Buy All Gurus Pass
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/chat">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Chatting
                  </Button>
                </Link>
                <Link href="/gurus">
                  <Button variant="outline" className="w-full">
                    <Crown className="mr-2 h-4 w-4" />
                    Browse Gurus
                  </Button>
                </Link>
                <Link href="/me">
                  <Button variant="outline" className="w-full">
                    <Star className="mr-2 h-4 w-4" />
                    My Proofs
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Having trouble with your account or access passes? 
                Check out our help resources or contact support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing">
                  <Button variant="outline">
                    View Pricing
                  </Button>
                </Link>
                <Link href="mailto:support@astroproof.app">
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutPass
          tier={checkoutTier}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false)
            loadAccountData()
          }}
        />
      )}
    </div>
  )
}
