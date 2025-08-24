'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, MessageCircle, Crown, Star, Sparkles } from 'lucide-react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import gurusData from '@/data/gurus.json'
import { deriveEffectiveTier, canAccessGuru } from '@/lib/access'
import { CheckoutPass } from '@/components/CheckoutPass'
import type { EffectiveAccess } from '@/lib/access'

const categoryColors = {
  general: 'bg-blue-500/20 text-blue-300',
  palmistry: 'bg-green-500/20 text-green-300',
  numerology: 'bg-purple-500/20 text-purple-300',
  vastu: 'bg-yellow-500/20 text-yellow-300',
  tarot: 'bg-pink-500/20 text-pink-300',
  vedic: 'bg-orange-500/20 text-orange-300',
}

export default function GurusPage() {
  const { connected, account } = useWallet()
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier')
  const [access, setAccess] = useState<EffectiveAccess | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [checkoutTier, setCheckoutTier] = useState<'ONE_GURU' | 'ALL_GURUS'>('ONE_GURU')
  const [selectedGuru, setSelectedGuru] = useState<string>('')

  useEffect(() => {
    if (connected && account?.address) {
      loadAccess()
    }
  }, [connected, account])

  useEffect(() => {
    if (tier === 'all') {
      setCheckoutTier('ALL_GURUS')
      setShowCheckout(true)
    }
  }, [tier])

  const loadAccess = async () => {
    if (!account?.address) return
    
    try {
      const effectiveAccess = await deriveEffectiveTier({ owner: account.address })
      setAccess(effectiveAccess)
    } catch (error) {
      console.error('Failed to load access:', error)
    }
  }

  const handleGuruSelect = (guruSlug: string) => {
    if (!connected) {
      // Redirect to connect wallet
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
      // This shouldn't happen, but redirect to chat anyway
      window.location.href = `/chat?guru=${guruSlug}`
      return
    }

    // Show checkout for this specific guru
    setSelectedGuru(guruSlug)
    setCheckoutTier('ONE_GURU')
    setShowCheckout(true)
  }

  const handleAllGurusAccess = () => {
    if (!connected) {
      return
    }

    if (access?.tier === 'ALL_GURUS') {
      // Already have access, go to chat
      window.location.href = '/chat'
      return
    }

    // Show checkout for all gurus
    setCheckoutTier('ALL_GURUS')
    setSelectedGuru('')
    setShowCheckout(true)
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
              <Crown className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Spiritual Gurus
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Choose Your Spiritual Guide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with AI embodiments of ancient wisdom traditions. Each guru specializes in 
              different aspects of spiritual knowledge and personal guidance.
            </p>
          </div>

          {/* Access Status */}
          {connected && access && (
            <Card className="mb-8 border-purple-500/20 bg-purple-500/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-purple-300">Current Access</p>
                    <p className="text-sm text-purple-200/80">
                      {access.tier === 'FREE' && `${access.freeChatsRemaining} free chats remaining today`}
                      {access.tier === 'ONE_GURU' && `Unlimited access to ${access.guruSlug} until ${new Date(access.expiresAt!).toLocaleString()}`}
                      {access.tier === 'ALL_GURUS' && `Unlimited access to all gurus until ${new Date(access.expiresAt!).toLocaleString()}`}
                    </p>
                  </div>
                  {access.tier !== 'ALL_GURUS' && (
                    <Button
                      onClick={handleAllGurusAccess}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Unlock All Gurus
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gurus Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {gurusData.map((guru) => {
              const hasAccess = access ? canAccessGuru(access, guru.slug) : false
              const isLocked = connected && !hasAccess && guru.slug !== 'astro-chatbot'
              
              return (
                <Card 
                  key={guru.slug}
                  className={`astro-card hover:border-purple-400/40 transition-all ${
                    isLocked ? 'opacity-75' : 'cursor-pointer hover:scale-105'
                  }`}
                  onClick={() => !isLocked && handleGuruSelect(guru.slug)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge 
                          className={`mb-3 ${categoryColors[guru.category as keyof typeof categoryColors] || categoryColors.general}`}
                        >
                          {guru.category}
                        </Badge>
                        <CardTitle className="text-lg mb-2">{guru.name}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">
                          {guru.title}
                        </p>
                      </div>
                      {isLocked && (
                        <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Crown className="h-3 w-3 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed">
                      {guru.short_blurb}
                    </p>

                    {/* Specialties */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Specializes in:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {guru.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs py-0 px-2"
                          >
                            {specialty.split(' ').slice(0, 3).join(' ')}
                          </Badge>
                        ))}
                        {guru.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs py-0 px-2">
                            +{guru.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                      {guru.slug === 'astro-chatbot' ? (
                        <Button 
                          className="w-full" 
                          variant="outline"
                          onClick={() => handleGuruSelect(guru.slug)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Chat Now (Free)
                        </Button>
                      ) : hasAccess ? (
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          onClick={() => handleGuruSelect(guru.slug)}
                        >
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Start Session
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            className="w-full"
                            variant="outline"
                            onClick={() => handleGuruSelect(guru.slug)}
                          >
                            <Crown className="mr-2 h-4 w-4" />
                            Get Access
                          </Button>
                          <p className="text-xs text-center text-muted-foreground">
                            {guru.availability_note}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Learn More Link */}
                    <div className="pt-2 border-t border-muted/20">
                      <Link 
                        href={`/gurus/${guru.slug}`}
                        className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Learn more about {guru.name} →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Pricing CTA */}
          <Card className="astro-card text-center">
            <CardContent className="p-8">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Ready for Premium Guidance?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Unlock unlimited access to specialized gurus with day passes. 
                Get deeper insights from traditional wisdom keepers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View All Pricing
                  </Button>
                </Link>
                <Button 
                  onClick={handleAllGurusAccess}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Unlock All Gurus
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutPass
          tier={checkoutTier}
          guruSlug={selectedGuru}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false)
            loadAccess()
          }}
        />
      )}
    </div>
  )
}
