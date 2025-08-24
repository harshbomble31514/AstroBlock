import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { VerifyView } from '@/components/VerifyView'
import { OwnerDeepVerify } from '@/components/OwnerDeepVerify'
import { ShareCard } from '@/components/ShareCard'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { readToken } from '@/lib/aptos'
import { Metadata } from 'next'

interface VerifyPageProps {
  params: {
    tokenId: string
  }
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  try {
    const tokenData = await readToken(params.tokenId)
    
    if (tokenData) {
      return {
        title: `AstroProof Verification - ${tokenData.name}`,
        description: `Verify this astrology reading proof on Aptos blockchain. Created ${new Date(tokenData.properties.created_at).toLocaleDateString()}.`,
        openGraph: {
          title: `AstroProof - ${tokenData.name}`,
          description: 'Verified astrology reading with blockchain proof',
          type: 'website',
          siteName: 'AstroProof',
        },
        twitter: {
          card: 'summary',
          title: `AstroProof - ${tokenData.name}`,
          description: 'Verified astrology reading with blockchain proof',
        },
      }
    }
  } catch (error) {
    // Fallback metadata if token can't be loaded
  }
  
  return {
    title: 'AstroProof Verification',
    description: 'Verify an astrology reading proof on Aptos blockchain',
  }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { tokenId } = params
  
  // Pre-load token data for share card
  let tokenData = null
  try {
    tokenData = await readToken(tokenId)
  } catch (error) {
    // Will be handled by VerifyView component
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
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              Proof Verification
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Verification */}
          <VerifyView tokenId={tokenId} />

          {/* Owner Deep Verification */}
          {tokenData && (
            <OwnerDeepVerify tokenData={tokenData} />
          )}

          {/* Share Card */}
          {tokenData && (
            <ShareCard tokenData={tokenData} />
          )}

          {/* Info Section */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              This verification page proves the authenticity of an AstroProof reading.
            </p>
            <p>
              The full reading is encrypted and can only be accessed by the owner.
            </p>
            <p className="text-xs">
              For entertainment purposes only. Not medical, legal, or financial advice.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button variant="outline">
                Get Your Reading
              </Button>
            </Link>
            <Link href="/me">
              <Button variant="outline">
                My Proofs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
