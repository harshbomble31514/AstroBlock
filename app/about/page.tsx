'use client'

import React from 'react'
import { Sparkles, Heart, Shield, Zap, Globe, Users, Target, Star, Crown, Brain, Lock, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

// Note: metadata moved to layout or parent component since this is now a client component

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Authentic Wisdom',
      description: 'We honor traditional spiritual practices while making them accessible through modern technology.'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your personal information never goes on-chain. Only anonymous proofs and access tokens are recorded.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Pioneering the intersection of AI, blockchain, and spirituality for the next generation of seekers.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Breaking down barriers to spiritual guidance, making wisdom traditions available worldwide.'
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former blockchain engineer turned spiritual tech entrepreneur. 10+ years studying Vedic astrology.',
      specialty: 'Blockchain Architecture'
    },
    {
      name: 'Dr. Raj Patel',
      role: 'Chief Spiritual Officer',
      bio: 'PhD in Religious Studies, practitioner of multiple wisdom traditions for 25+ years.',
      specialty: 'Traditional Wisdom'
    },
    {
      name: 'Maya Rodriguez',
      role: 'Head of AI',
      bio: 'Former OpenAI researcher specializing in ethical AI and natural language understanding.',
      specialty: 'AI Ethics & Development'
    },
    {
      name: 'David Kim',
      role: 'Lead Developer',
      bio: 'Full-stack engineer with expertise in Web3 and decentralized applications.',
      specialty: 'Web3 Development'
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: 'AstroProof Launch',
      description: 'Launched on Aptos testnet with 6 specialized AI gurus and blockchain verification.'
    },
    {
      year: '2023',
      title: 'Seed Funding',
      description: 'Raised $2M seed round from leading Web3 and wellness investors.'
    },
    {
      year: '2023',
      title: 'Team Formation',
      description: 'Assembled world-class team of blockchain engineers, AI researchers, and spiritual advisors.'
    },
    {
      year: '2022',
      title: 'Concept & Research',
      description: 'Began developing the vision for provable spiritual guidance on blockchain.'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-purple-400" />
                <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Bridging Ancient Wisdom</span>
              <br />
              <span className="text-white">with Modern Technology</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              AstroProof combines millennia-old spiritual traditions with cutting-edge blockchain technology, 
              creating the world's first verifiable spiritual guidance platform powered by AI and secured by cryptography.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/gurus">
                <Button size="lg" variant="outline">
                  Meet Our Gurus
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section id="mission" className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              To democratize access to authentic spiritual wisdom while preserving the integrity and privacy 
              of both seekers and guidance through innovative blockchain technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="astro-card">
              <CardHeader>
                <Target className="h-8 w-8 text-purple-400 mb-4" />
                <CardTitle>Why We Exist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Traditional spiritual guidance has always been limited by geography, availability, and accessibility. 
                  We believe everyone deserves access to authentic wisdom traditions, regardless of location or background.
                </p>
                <p>
                  By combining AI with ancient knowledge systems and securing interactions with blockchain technology, 
                  we create a new paradigm where spiritual guidance is both globally accessible and cryptographically verifiable.
                </p>
              </CardContent>
            </Card>

            <Card className="astro-card">
              <CardHeader>
                <Star className="h-8 w-8 text-purple-400 mb-4" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  We envision a world where spiritual seekers can receive authentic guidance from AI embodiments 
                  of traditional wisdom keepers, with complete confidence in the integrity and privacy of their journey.
                </p>
                <p>
                  Through blockchain verification, we ensure that spiritual guidance maintains its authenticity 
                  while protecting the privacy of those who seek it—creating trust in the digital age.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Our Values</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to community building.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="astro-card text-center">
                  <CardContent className="p-6">
                    <Icon className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines three cutting-edge technologies to deliver unprecedented spiritual guidance.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="astro-card">
              <CardHeader>
                <Brain className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle>AI-Powered Gurus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Our AI models are trained on extensive spiritual literature and traditional wisdom texts, 
                  creating authentic personas that embody different spiritual traditions.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Vedic Astrology Masters</li>
                  <li>• Tarot & Divination Experts</li>
                  <li>• Numerology Oracles</li>
                  <li>• Palmistry Sages</li>
                  <li>• Relationship Guides</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="astro-card">
              <CardHeader>
                <LinkIcon className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle>Blockchain Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Every reading and interaction is cryptographically verified on the Aptos blockchain, 
                  creating immutable proof without exposing personal information.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Session authenticity proofs</li>
                  <li>• Access token verification</li>
                  <li>• Timestamp integrity</li>
                  <li>• Anonymous verification</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="astro-card">
              <CardHeader>
                <Lock className="h-10 w-10 text-purple-400 mb-4" />
                <CardTitle>Privacy Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <p>
                  Client-side encryption ensures that your personal information and reading content 
                  never leaves your device unencrypted.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• End-to-end encryption</li>
                  <li>• Zero-knowledge proofs</li>
                  <li>• Anonymous authentication</li>
                  <li>• Self-custody of data</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Meet Our Team</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We're a diverse team of technologists, spiritual practitioners, and visionaries 
              working to transform how people access wisdom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="astro-card text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{member.bio}</p>
                  <div className="text-xs text-purple-300 bg-purple-500/10 rounded-full px-3 py-1 inline-block">
                    {member.specialty}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 gradient-text">Our Journey</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From concept to reality, here's how we've built the future of spiritual guidance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  <Card className="astro-card flex-1">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-300">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="astro-card max-w-4xl mx-auto text-center">
            <CardContent className="p-12">
              <Sparkles className="h-16 w-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-6 gradient-text">Join the Future of Spiritual Guidance</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Experience the perfect blend of ancient wisdom and modern technology. 
                Start your journey with AstroProof today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pricing">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    View Pricing Plans
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
