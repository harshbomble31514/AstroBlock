import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - AstroProof',
  description: 'Learn how AstroProof protects your privacy with client-side encryption and blockchain technology.',
  keywords: 'privacy policy, data protection, encryption, blockchain privacy',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
