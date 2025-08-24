import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - AstroProof',
  description: 'Review the terms and conditions for using AstroProof\'s spiritual guidance platform.',
  keywords: 'terms of service, terms and conditions, user agreement, legal',
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
