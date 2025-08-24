'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Share2, Copy, MessageCircle, Twitter, ExternalLink } from 'lucide-react'
import { TokenData } from '@/lib/aptos'
import { getShareText, truncateText } from '@/lib/format'
import { toast } from '@/components/Toast'

interface ShareCardProps {
  tokenData: TokenData
  readingPreview?: string
}

export function ShareCard({ tokenData, readingPreview }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  
  const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/v/${tokenData.tokenId}`
  
  // Generate preview text (first ~120 chars of description or generic text)
  const preview = readingPreview || 
    truncateText(tokenData.description || 'Check out my verified astrology reading', 120)
  
  const shareText = getShareText(preview)
  const fullShareText = `${shareText}\n\n${verifyUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText)
      setCopied(true)
      toast({
        title: 'Copied!',
        description: 'Share link copied to clipboard.',
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy to clipboard.',
        variant: 'destructive',
      })
    }
  }

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(fullShareText + '\n\n#AstroProof #Aptos #Astrology')
    const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const shareOnWhatsApp = () => {
    const whatsappText = encodeURIComponent(fullShareText)
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AstroProof - Verified Astrology Reading',
          text: shareText,
          url: verifyUrl,
        })
      } catch (error) {
        // User cancelled or sharing failed
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <Card className="border-blue-500/20 bg-blue-500/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share2 className="h-5 w-5 text-blue-400" />
          <span className="text-blue-300">Share Your Proof</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/20 rounded-lg border border-blue-500/20">
          <h4 className="font-medium mb-2 text-blue-300">Preview</h4>
          <p className="text-sm text-blue-200/80 leading-relaxed">
            {preview}
          </p>
          <div className="mt-3 pt-3 border-t border-blue-500/20">
            <p className="text-xs text-blue-200/60">
              🔗 Verify on Aptos blockchain: {verifyUrl}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={shareNative}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="border-blue-500/30"
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>

          <Button
            onClick={shareOnTwitter}
            variant="outline"
            className="border-blue-500/30"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>

          <Button
            onClick={shareOnWhatsApp}
            variant="outline"
            className="border-blue-500/30"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        </div>

        <div className="text-center">
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <span>Open verification page</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <p className="text-xs text-blue-200/60 text-center">
          Share your verified astrology reading while keeping your personal details private.
          Only anonymous proof hashes are visible to others.
        </p>
      </CardContent>
    </Card>
  )
}
