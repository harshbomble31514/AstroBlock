import React from 'react'
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle, Mail, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

// Note: metadata handled by layout

export default function PrivacyPage() {
  const lastUpdated = "December 2024"
  
  const privacyPrinciples = [
    {
      icon: Lock,
      title: 'Client-Side Encryption',
      description: 'All sensitive data is encrypted in your browser before leaving your device'
    },
    {
      icon: Eye,
      title: 'Zero-Knowledge Architecture',
      description: 'We cannot see your personal information or reading content'
    },
    {
      icon: Database,
      title: 'Minimal Data Collection',
      description: 'We only collect what\'s necessary for the service to function'
    },
    {
      icon: UserCheck,
      title: 'User Control',
      description: 'You own and control your data, with full deletion rights'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <Shield className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">
              <span className="gradient-text">Privacy Policy</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Your privacy is fundamental to our mission. Learn how we protect your personal information 
              while providing spiritual guidance on the blockchain.
            </p>
            <p className="text-sm text-gray-400 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* Privacy Principles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon
              return (
                <Card key={index} className="astro-card text-center">
                  <CardContent className="p-6">
                    <Icon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{principle.title}</h3>
                    <p className="text-sm text-gray-300">{principle.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Information We Collect */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-purple-400" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Wallet Information</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Your Aptos wallet address (public blockchain address)</li>
                  <li>• Transaction signatures and hashes</li>
                  <li>• AccessPass NFT ownership data</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Usage Data</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Chat frequency for free tier limits (stored anonymously)</li>
                  <li>• Feature usage analytics (aggregated and anonymized)</li>
                  <li>• Error logs for troubleshooting (no personal data)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Optional Encrypted Data</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Chat transcripts (encrypted with your passphrase)</li>
                  <li>• Reading reports (encrypted client-side)</li>
                  <li>• User preferences (encrypted)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Protect Your Privacy */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-purple-400" />
                <span>How We Protect Your Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Client-Side Encryption</h4>
                <p className="text-gray-300 leading-relaxed">
                  All sensitive data is encrypted in your browser using AES-GCM with keys derived from your passphrase. 
                  We never have access to your encryption keys or unencrypted personal data.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Blockchain Privacy</h4>
                <p className="text-gray-300 leading-relaxed">
                  Only anonymous hashes and access tokens are stored on the Aptos blockchain. No personal information, 
                  reading content, or identifying data ever goes on-chain.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Anonymous Usage Tracking</h4>
                <p className="text-gray-300 leading-relaxed">
                  Free tier usage limits are tracked using anonymous daily counters. We cannot link this data 
                  to your identity or personal information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Data We Never Collect */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-400" />
                <span>Data We Never Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-300 mb-2">Personal Information</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Real names or identities</li>
                    <li>• Birth dates or times</li>
                    <li>• Location data</li>
                    <li>• Phone numbers</li>
                    <li>• Email addresses (except for support)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-300 mb-2">Sensitive Data</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Reading content (stored encrypted only)</li>
                    <li>• Chat conversations (encrypted only)</li>
                    <li>• Private keys or passphrases</li>
                    <li>• Financial information</li>
                    <li>• Health or medical data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights and Controls */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-purple-400" />
                <span>Your Rights and Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Data Ownership</h4>
                <p className="text-gray-300 leading-relaxed">
                  You own all data associated with your account. Encrypted data can only be accessed with your passphrase, 
                  which we never store or have access to.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Deletion Rights</h4>
                <p className="text-gray-300 leading-relaxed">
                  You can delete your encrypted data at any time. Note that blockchain records are immutable 
                  but contain no personal information—only anonymous proofs.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Data Portability</h4>
                <p className="text-gray-300 leading-relaxed">
                  You can export your encrypted data and use it with other compatible applications. 
                  Your access passes are NFTs that you fully own and control.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Third Parties */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>Third-Party Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Blockchain Networks</h4>
                <p className="text-gray-300 leading-relaxed">
                  We use the Aptos blockchain to store anonymous proofs and access tokens. 
                  Blockchain data is public but contains no personal information.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">AI Services</h4>
                <p className="text-gray-300 leading-relaxed">
                  When available, we use OpenAI's API for generating responses. Conversations are anonymized 
                  and no personal information is sent to AI providers.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Analytics</h4>
                <p className="text-gray-300 leading-relaxed">
                  We use privacy-focused analytics to understand usage patterns. All data is aggregated 
                  and anonymized—we cannot identify individual users.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <span>Security Measures</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>End-to-end encryption for all sensitive data using industry-standard AES-GCM</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Secure key derivation using PBKDF2 with strong salt generation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Zero-knowledge architecture ensuring we cannot access your data</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Secure infrastructure with encrypted data transmission</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Privacy Policy */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span>Changes to This Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update this privacy policy from time to time to reflect changes in our practices, 
                technology, or legal requirements. We will notify users of any material changes by:
              </p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li>• Posting the updated policy on our website</li>
                <li>• Displaying a notice on our platform</li>
                <li>• Sending an email notification (if you've provided contact information)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Your continued use of AstroProof after any changes indicates your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-400" />
                <span>Contact Us About Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about this privacy policy, our data practices, or want to exercise your privacy rights, 
                please contact us:
              </p>
              <div className="bg-muted/10 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <strong className="text-purple-300">Email:</strong> privacy@astroproof.app
                </p>
                <p className="text-sm">
                  <strong className="text-purple-300">General Support:</strong> support@astroproof.app
                </p>
                <p className="text-sm">
                  <strong className="text-purple-300">Response Time:</strong> Within 72 hours
                </p>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                For immediate privacy concerns or data deletion requests, please use the privacy email address above.
              </p>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card className="astro-card text-center">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Related Information</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/terms" className="text-purple-400 hover:text-purple-300 font-medium">
                  Terms of Service
                </Link>
                <Link href="/help" className="text-purple-400 hover:text-purple-300 font-medium">
                  Help Center
                </Link>
                <Link href="/contact" className="text-purple-400 hover:text-purple-300 font-medium">
                  Contact Support
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
