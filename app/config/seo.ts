import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://astroproof.app'

export const defaultMetadata: Metadata = {
  title: 'AstroProof - AI Astrology with Blockchain Verification',
  description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain. Public proof, private details.',
  keywords: [
    'astrology',
    'AI',
    'blockchain',
    'Aptos',
    'NFT',
    'proof',
    'verification',
    'crypto',
    'horoscope',
    'birth chart'
  ],
  authors: [{ name: 'AstroProof' }],
  creator: 'AstroProof',
  publisher: 'AstroProof',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'AstroProof',
    title: 'AstroProof - AI Astrology with Blockchain Verification',
    description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain. Public proof, private details.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AstroProof - AI Astrology with Blockchain Verification',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstroProof - AI Astrology with Blockchain Verification',
    description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@astroproof',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export function generateReadingMetadata(
  tokenId: string,
  tokenName?: string,
  createdAt?: string
): Metadata {
  const title = tokenName 
    ? `AstroProof Verification - ${tokenName}`
    : 'AstroProof Verification'
  
  const description = createdAt
    ? `Verify this astrology reading proof on Aptos blockchain. Created ${new Date(createdAt).toLocaleDateString()}.`
    : 'Verify this astrology reading proof on Aptos blockchain.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${siteUrl}/v/${tokenId}`,
      siteName: 'AstroProof',
      images: [
        {
          url: `${siteUrl}/og-reading.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [`${siteUrl}/og-reading.png`],
    },
    alternates: {
      canonical: `${siteUrl}/v/${tokenId}`,
    },
  }
}
