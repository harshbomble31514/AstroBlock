import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - AstroProof',
  description: 'Find answers to common questions about AstroProof. Comprehensive help documentation for getting started, payments, and troubleshooting.',
  keywords: 'help center, FAQ, support, documentation, how to use astroproof',
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
