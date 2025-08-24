import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - AstroProof',
  description: 'Learn about AstroProof\'s mission to bridge ancient wisdom with blockchain technology, providing authentic spiritual guidance with cryptographic proof.',
  keywords: 'about astroproof, spiritual technology, blockchain astrology, AI gurus, aptos blockchain',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
