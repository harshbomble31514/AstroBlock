import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, MessageCircle, Crown, Star } from 'lucide-react'
import gurusData from '@/data/gurus.json'
import { GuruAccessCheck } from '@/components/GuruAccessCheck'
import { Metadata } from 'next'

interface GuruPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return gurusData.map((guru) => ({
    slug: guru.slug,
  }))
}

export async function generateMetadata({ params }: GuruPageProps): Promise<Metadata> {
  const guru = gurusData.find(g => g.slug === params.slug)
  
  if (!guru) {
    return {
      title: 'Guru Not Found - AstroProof',
    }
  }

  return {
    title: `${guru.name} - ${guru.title} | AstroProof`,
    description: guru.long_description,
    openGraph: {
      title: `${guru.name} - ${guru.title}`,
      description: guru.short_blurb,
      type: 'profile',
    },
  }
}

export default function GuruPage({ params }: GuruPageProps) {
  const guru = gurusData.find(g => g.slug === params.slug)

  if (!guru) {
    notFound()
  }

  const categoryColors = {
    general: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    palmistry: 'bg-green-500/20 text-green-300 border-green-500/30',
    numerology: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    vastu: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    tarot: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    vedic: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/gurus">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gurus
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Guru Profile
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <Card className="astro-card mb-8">
            <CardContent className="p-8">
              <div className="text-center">
                {/* Avatar Placeholder */}
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Crown className="h-12 w-12 text-white" />
                </div>

                <Badge 
                  className={`mb-4 ${categoryColors[guru.category as keyof typeof categoryColors] || categoryColors.general}`}
                >
                  {guru.category.charAt(0).toUpperCase() + guru.category.slice(1)} Specialist
                </Badge>

                <h1 className="text-4xl font-bold mb-2">{guru.name}</h1>
                <p className="text-xl text-muted-foreground mb-6">{guru.title}</p>
                
                <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                  {guru.short_blurb}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="astro-card mb-8">
            <CardHeader>
              <CardTitle>About {guru.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {guru.long_description}
              </p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card className="astro-card mb-8">
            <CardHeader>
              <CardTitle>Areas of Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guru.specialties.map((specialty, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{specialty}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sample Prompts */}
          <Card className="astro-card mb-8">
            <CardHeader>
              <CardTitle>Example Questions to Ask</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guru.sample_prompts.map((prompt, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
                  >
                    <p className="text-sm italic">"{prompt}"</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Access Check and CTA */}
          <GuruAccessCheck guruSlug={guru.slug} guruName={guru.name} />

          {/* Navigation */}
          <div className="flex justify-center space-x-4 mt-8">
            <Link href="/gurus">
              <Button variant="outline">
                View All Gurus
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">
                View Pricing
              </Button>
            </Link>
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                Start Chatting
              </Button>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>
              All guidance is for entertainment and spiritual reflection only, not medical, legal, or financial advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
