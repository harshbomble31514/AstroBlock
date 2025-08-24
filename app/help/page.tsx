'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, ChevronRight, HelpCircle, Book, Zap, Shield, Wallet, MessageCircle, Star, ExternalLink, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>('getting-started')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Star,
      description: 'Learn the basics of using AstroProof',
      color: 'text-blue-400'
    },
    {
      id: 'wallet-blockchain',
      title: 'Wallet & Blockchain',
      icon: Wallet,
      description: 'Aptos wallet setup and blockchain features',
      color: 'text-purple-400'
    },
    {
      id: 'gurus-chat',
      title: 'Gurus & Chat',
      icon: MessageCircle,
      description: 'How to chat with AI spiritual guides',
      color: 'text-green-400'
    },
    {
      id: 'pricing-subscriptions',
      title: 'Pricing & Subscriptions',
      icon: Zap,
      description: 'Understanding subscription tiers and payments',
      color: 'text-yellow-400'
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'How we protect your data and privacy',
      color: 'text-red-400'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: HelpCircle,
      description: 'Common issues and solutions',
      color: 'text-indigo-400'
    },
  ]

  const faqs = {
    'getting-started': [
      {
        id: 'what-is-astroproof',
        question: 'What is AstroProof?',
        answer: 'AstroProof is a spiritual guidance platform that combines AI-powered gurus with blockchain verification. You can chat with specialized spiritual guides and get cryptographic proof of your interactions on the Aptos blockchain.'
      },
      {
        id: 'how-to-start',
        question: 'How do I get started?',
        answer: 'Simply visit our homepage, connect your Aptos wallet (like Petra), and you can immediately start chatting with our free Astro Chatbot. For premium gurus, you can purchase day passes or upgrade your subscription.'
      },
      {
        id: 'no-wallet',
        question: 'Can I use AstroProof without a crypto wallet?',
        answer: 'While you can browse our gurus and read about our services, you need an Aptos wallet to chat with gurus and receive blockchain-verified readings. We recommend Petra wallet for the best experience.'
      },
      {
        id: 'first-reading',
        question: 'How do I get my first reading?',
        answer: 'Connect your wallet, go to the Chat page, and start talking with the Astro Chatbot (free tier). You get 3 free chats per day. For specialized gurus, purchase a day pass.'
      },
    ],
    'wallet-blockchain': [
      {
        id: 'supported-wallets',
        question: 'Which wallets are supported?',
        answer: 'We currently support Petra wallet and other Aptos-compatible wallets. Petra wallet is recommended for the best user experience.'
      },
      {
        id: 'setup-wallet',
        question: 'How do I set up an Aptos wallet?',
        answer: 'Download Petra wallet from petra.app, create an account, and switch to Aptos testnet. You can get free testnet APT from the Aptos faucet to start using AstroProof.'
      },
      {
        id: 'blockchain-proof',
        question: 'What is blockchain proof?',
        answer: 'Every reading generates cryptographic hashes that are stored on Aptos blockchain. This creates immutable proof that your reading happened without exposing any personal information.'
      },
      {
        id: 'testnet-mainnet',
        question: 'Do you use Aptos mainnet or testnet?',
        answer: 'Currently, we operate on Aptos testnet for development and testing. We plan to migrate to mainnet after our beta phase is complete.'
      },
    ],
    'gurus-chat': [
      {
        id: 'available-gurus',
        question: 'What gurus are available?',
        answer: 'We have 6 specialized AI gurus: Astro Chatbot (free), Palmistry Sage, Numerology Oracle, Vastu Acharya, Tarot Seer, Vedic Astrologer, and Relationship Guide.'
      },
      {
        id: 'guru-accuracy',
        question: 'How accurate are the AI guru readings?',
        answer: 'Our AI gurus are designed for guidance, reflection, and spiritual insight—not prediction. They draw from traditional wisdom texts and should be used for personal growth, not as substitutes for professional advice.'
      },
      {
        id: 'chat-limits',
        question: 'Are there limits on chatting?',
        answer: 'Free tier: 3 chats per day with Astro Chatbot only. One Guru Pass: Unlimited chats with chosen guru for 24 hours. All Gurus Pass: Unlimited chats with any guru for 24 hours.'
      },
      {
        id: 'save-conversations',
        question: 'Are my conversations saved?',
        answer: 'Conversations can be optionally encrypted and stored off-chain. You control your data with client-side encryption keys. No personal information ever goes on the blockchain.'
      },
    ],
    'pricing-subscriptions': [
      {
        id: 'subscription-tiers',
        question: 'What are the subscription tiers?',
        answer: 'Free (3 chats/day with Astro Chatbot), One Guru Day Pass (0.20 APT for 24h unlimited access to one guru), All Gurus Day Pass (0.50 APT for 24h unlimited access to all gurus).'
      },
      {
        id: 'payment-methods',
        question: 'How do I pay for subscriptions?',
        answer: 'All payments are made in APT tokens through your connected wallet. We use a two-transaction flow: first you pay APT to our treasury, then we mint an AccessPass NFT to your wallet.'
      },
      {
        id: 'refund-policy',
        question: 'What is your refund policy?',
        answer: 'Due to the digital nature of our services and blockchain transactions, all sales are final. However, if you experience technical issues, please contact our support team.'
      },
      {
        id: 'pass-duration',
        question: 'How long do day passes last?',
        answer: 'Day passes last exactly 24 hours from the time of purchase. You can check your remaining time in your account page.'
      },
    ],
    'privacy-security': [
      {
        id: 'data-privacy',
        question: 'How is my data protected?',
        answer: 'We use client-side AES-GCM encryption for all sensitive data. Your personal information never leaves your device unencrypted and never goes on the blockchain.'
      },
      {
        id: 'on-chain-data',
        question: 'What data goes on the blockchain?',
        answer: 'Only anonymous hashes, timestamps, and access tokens are stored on-chain. No personal information, reading content, or identifying data is ever recorded on the blockchain.'
      },
      {
        id: 'account-security',
        question: 'How do I keep my account secure?',
        answer: 'Keep your wallet private keys secure, never share your passphrase, and always verify you\'re on the correct website (astroproof.app) before connecting your wallet.'
      },
      {
        id: 'data-deletion',
        question: 'Can I delete my data?',
        answer: 'Yes! You control your encrypted data. You can delete stored conversations anytime. Blockchain records are immutable but contain no personal information.'
      },
    ],
    'troubleshooting': [
      {
        id: 'wallet-connection-fails',
        question: 'My wallet won\'t connect',
        answer: 'Ensure Petra wallet is installed and unlocked, check you\'re on Aptos testnet, refresh the page, and try again. Clear browser cache if issues persist.'
      },
      {
        id: 'payment-stuck',
        question: 'My payment is stuck',
        answer: 'If payment transaction succeeded but AccessPass wasn\'t minted, wait a few minutes and check your account. Contact support if the issue persists after 10 minutes.'
      },
      {
        id: 'guru-not-responding',
        question: 'Guru is not responding',
        answer: 'Check your internet connection, verify you have an active subscription, and try refreshing the page. Our AI may take a few seconds to respond to complex queries.'
      },
      {
        id: 'reading-not-loading',
        question: 'My reading won\'t load',
        answer: 'Ensure you have the correct passphrase, check your internet connection, and verify the reading URL. Contact support if the reading is corrupted.'
      },
    ],
  }

  const quickActions = [
    {
      title: 'Connect Petra Wallet',
      description: 'Step-by-step wallet setup guide',
      icon: Wallet,
      href: 'https://petra.app/',
      external: true
    },
    {
      title: 'Get Testnet APT',
      description: 'Free tokens for testing',
      icon: Zap,
      href: 'https://aptoslabs.com/testnet-faucet',
      external: true
    },
    {
      title: 'Start Chatting',
      description: 'Begin your spiritual journey',
      icon: MessageCircle,
      href: '/chat',
      external: false
    },
    {
      title: 'View Pricing',
      description: 'Choose your subscription tier',
      icon: Star,
      href: '/pricing',
      external: false
    },
  ]

  const filteredFaqs = searchTerm
    ? Object.entries(faqs).reduce((acc, [categoryId, categoryFaqs]) => {
        const filtered = categoryFaqs.filter(
          faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (filtered.length > 0) {
          (acc as any)[categoryId] = filtered
        }
        return acc
      }, {} as typeof faqs)
    : faqs

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Help Center</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Everything you need to know about using AstroProof, from getting started to advanced features.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="astro-card hover:bg-muted/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <Icon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{action.description}</p>
                  {action.external ? (
                    <a
                      href={action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 text-sm"
                    >
                      Visit <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <Link href={action.href} className="text-purple-400 hover:text-purple-300 text-sm">
                      Go to page
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Categories and FAQs */}
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card className="astro-card sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-purple-400" />
                  <span>Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon
                    const isExpanded = expandedCategory === category.id
                    return (
                      <button
                        key={category.id}
                        onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left ${
                          isExpanded ? 'bg-purple-500/20 text-purple-300' : 'hover:bg-muted/50'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${category.color}`} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{category.title}</div>
                          <div className="text-xs text-gray-400">{category.description}</div>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {Object.entries(filteredFaqs).map(([categoryId, categoryFaqs]) => {
                const category = categories.find(c => c.id === categoryId)
                if (!category) return null

                const Icon = category.icon
                const isExpanded = expandedCategory === categoryId

                return (
                  <Card key={categoryId} className="astro-card">
                    <CardHeader>
                      <button
                        onClick={() => setExpandedCategory(isExpanded ? null : categoryId)}
                        className="flex items-center space-x-3 w-full text-left"
                      >
                        <Icon className={`h-6 w-6 ${category.color}`} />
                        <div className="flex-1">
                          <CardTitle>{category.title}</CardTitle>
                          <p className="text-sm text-gray-400 mt-1">{category.description}</p>
                        </div>
                        <Badge variant="outline">
                          {categoryFaqs.length} articles
                        </Badge>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                      </button>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent>
                        <div className="space-y-4">
                          {categoryFaqs.map((faq) => {
                            const isExpanded = expandedFaq === faq.id
                            return (
                              <div key={faq.id} className="border border-muted/20 rounded-lg">
                                <button
                                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
                                >
                                  <span className="font-medium pr-4">{faq.question}</span>
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 text-purple-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-purple-400" />
                                  )}
                                </button>
                                {isExpanded && (
                                  <div className="px-4 pb-4">
                                    <div className="bg-muted/10 rounded-lg p-4">
                                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Still need help? */}
        <Card className="astro-card max-w-4xl mx-auto mt-16 text-center">
          <CardContent className="p-8">
            <HelpCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 gradient-text">Still Need Help?</h3>
            <p className="text-gray-300 mb-6">
              Can't find what you're looking for? Our support team is here to help you succeed with AstroProof.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Contact Support
                </Button>
              </Link>
              <a href="mailto:support@astroproof.app">
                <Button size="lg" variant="outline">
                  Email Us Directly
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
