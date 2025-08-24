import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - AstroProof',
  description: 'Get in touch with AstroProof support team. Multiple contact channels available for help, partnerships, and technical support.',
  keywords: 'contact astroproof, support, help, customer service, technical support',
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
