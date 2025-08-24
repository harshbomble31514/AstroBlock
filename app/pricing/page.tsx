'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Check, ArrowLeft, Sparkles, Crown, Star } from 'lucide-react'
import { WalletConnect } from '@/components/WalletConnect'

const tiers = [
  {
    name: 'Free',
    price: 'Free',
    period: '',
    description: 'Get started with basic astrology guidance',
    features: [
      '3 chats per day with Astro Chatbot',
      'General astrology insights',
      'Daily cosmic guidance',
      'Basic zodiac information',
      'Community support'
    ],
    limitations: [
      'Limited to general chatbot only',
      'Daily usage limits',
      'No access to specialized gurus'
    ],
    ctaText: 'Start Chatting',
    ctaLink: '/chat',
    icon: Sparkles,
    popular: false,
  },
  {
    name: 'One Guru Day Pass',
    price: process.env.NEXT_PUBLIC_PRICE_ONE_GURU_APT || '0.20',
    period: 'APT for 24h',
    description: 'Unlimited access to one chosen specialized guru',
    features: [
      'Choose any one specialized guru',
      'Unlimited chats for 24 hours',
      'Expert knowledge in chosen field',
      'Personalized guidance',
      'Premium support',
      'Chat history saved'
    ],
    limitations: [
      'Access to only one guru',
      'Limited to 24-hour period'
    ],
    ctaText: 'Choose a Guru',
    ctaLink: '/gurus',
    icon: Crown,
    popular: true,
  },
  {
    name: 'All Gurus Day Pass',
    price: process.env.NEXT_PUBLIC_PRICE_ALL_GURUS_APT || '0.50',
    period: 'APT for 24h',
    description: 'Complete access to all specialized wisdom traditions',
    features: [
      'Access to ALL specialized gurus',
      'Switch between gurus anytime',
      'Unlimited chats for 24 hours',
      'Compare different perspectives',
      'Complete spiritual toolkit',
      'Priority support',
      'Full chat history'
    ],
    limitations: [],
    ctaText: 'Unlock All Gurus',
    ctaLink: '/gurus?tier=all',
    icon: Star,
    popular: false,
  },
]

export default function PricingPage() {
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
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Choose Your Path
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Intro */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Access Ancient Wisdom Through AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from three tiers of spiritual guidance, from free general astrology to unlimited access 
              to specialized gurus representing different wisdom traditions.
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="mb-12">
            <WalletConnect />
          </div>

          {/* Pricing Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {tiers.map((tier, index) => {
              const Icon = tier.icon
              return (
                <Card 
                  key={tier.name}
                  className={`relative ${tier.popular 
                    ? 'border-purple-500/50 bg-purple-500/10 scale-105' 
                    : 'astro-card'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="mt-2">
                      <div className="text-3xl font-bold gradient-text">
                        {tier.price}
                      </div>
                      {tier.period && (
                        <div className="text-sm text-muted-foreground">
                          {tier.period}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {tier.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features */}
                    <div className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {tier.limitations.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-muted/20">
                        <p className="text-xs text-muted-foreground font-medium">
                          Limitations:
                        </p>
                        {tier.limitations.map((limitation, idx) => (
                          <p key={idx} className="text-xs text-muted-foreground">
                            • {limitation}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <Link href={tier.ctaLink} className="block">
                      <Button 
                        className={`w-full ${tier.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                          : ''
                        }`}
                        variant={tier.popular ? 'default' : 'outline'}
                      >
                        {tier.ctaText}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* How It Works */}
          <Card className="astro-card mb-12">
            <CardHeader>
              <CardTitle className="text-center">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your Aptos wallet to access premium features and make payments.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Choose & Pay</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your tier and pay with APT. Your access pass is minted as an NFT on Aptos.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Start Chatting</h3>
                  <p className="text-sm text-muted-foreground">
                    Access your chosen gurus and start receiving personalized spiritual guidance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="astro-card mb-12">
            <CardHeader>
              <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">What's included in each tier?</h4>
                <p className="text-sm text-muted-foreground">
                  Free tier gives you 3 daily chats with our general Astro Chatbot. Day passes provide unlimited chats with specialized AI gurus for 24 hours.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">How does the blockchain proof work?</h4>
                <p className="text-sm text-muted-foreground">
                  Your access pass is minted as an NFT on Aptos blockchain, providing immutable proof of your subscription. No personal data goes on-chain.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Can I upgrade or extend my pass?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes! You can purchase additional passes at any time. Multiple passes stack, extending your access period.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Is my data private?</h4>
                <p className="text-sm text-muted-foreground">
                  Absolutely. Chat transcripts are encrypted client-side, and only you have the key. No personal information is stored on the blockchain.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Public proof, private details. Only anonymous fingerprints go on-chain.
            </p>
            <p>
              All guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
