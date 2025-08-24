import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { WalletProvider } from '@/providers/WalletProvider'
import { FirebaseProvider } from '@/providers/FirebaseProvider'
import { Toaster } from '@/components/Toast'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Astroblock - AI Astrology with Blockchain Verification',
  description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain. Public proof, private details.',
  keywords: 'astrology, AI, blockchain, Aptos, NFT, proof, verification',
  authors: [{ name: 'Astroblock' }],
  openGraph: {
    title: 'Astroblock - AI Astrology with Blockchain Verification',
    description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain.',
    type: 'website',
    siteName: 'Astroblock',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astroblock - AI Astrology with Blockchain Verification',
    description: 'Get personalized AI astrology readings with cryptographic proof on Aptos blockchain.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FirebaseProvider>
            <WalletProvider>
              <Header />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
              <Toaster />
            </WalletProvider>
          </FirebaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
