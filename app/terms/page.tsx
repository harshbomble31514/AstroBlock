import React from 'react'
import { FileText, AlertTriangle, Scale, Shield, DollarSign, UserX, Mail, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

// Note: metadata handled by layout

export default function TermsPage() {
  const lastUpdated = "December 2024"
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <FileText className="h-16 w-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Terms of Service</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Please read these terms carefully before using AstroProof. 
            By accessing our platform, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Acceptance of Terms */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-purple-400" />
                <span>1. Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                By accessing, browsing, or using AstroProof ("the Platform", "our Service"), you acknowledge 
                that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If you do not agree to these terms, please do not use our platform. These terms constitute 
                a legally binding agreement between you and AstroProof.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-400" />
                <span>2. Service Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                AstroProof provides AI-powered spiritual guidance services with blockchain verification. Our platform includes:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• Interactive conversations with AI spiritual guides ("Gurus")</li>
                <li>• Blockchain-verified access passes and reading proofs</li>
                <li>• Client-side encrypted storage of conversations and readings</li>
                <li>• Various subscription tiers with different access levels</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-300 mb-2">Important Disclaimer</h4>
                    <p className="text-amber-200 text-sm leading-relaxed">
                      Our service provides spiritual guidance and entertainment. It is NOT a substitute for professional 
                      medical, legal, financial, or psychological advice. Always consult qualified professionals for serious decisions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Eligibility */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserX className="h-5 w-5 text-purple-400" />
                <span>3. User Eligibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                To use AstroProof, you must:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• Be at least 18 years old or have parental consent</li>
                <li>• Have the legal capacity to enter into this agreement</li>
                <li>• Possess a compatible Aptos blockchain wallet</li>
                <li>• Not be prohibited from using our services under applicable law</li>
                <li>• Provide accurate information when required</li>
              </ul>
            </CardContent>
          </Card>

          {/* Account and Wallet */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>4. Account and Wallet Responsibility</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Wallet Security</h4>
                <p className="text-gray-300 leading-relaxed mb-3">
                  You are solely responsible for maintaining the security of your cryptocurrency wallet, private keys, 
                  and passphrases. AstroProof cannot recover lost wallets or access credentials.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Account Activities</h4>
                <p className="text-gray-300 leading-relaxed">
                  You are responsible for all activities that occur through your connected wallet. 
                  Notify us immediately if you suspect unauthorized access to your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription and Payments */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-400" />
                <span>5. Subscriptions and Payments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Subscription Tiers</h4>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• <strong>Free Tier:</strong> Limited daily chats with Astro Chatbot</li>
                  <li>• <strong>One Guru Pass:</strong> 24-hour unlimited access to one chosen guru</li>
                  <li>• <strong>All Gurus Pass:</strong> 24-hour unlimited access to all gurus</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Payment Terms</h4>
                <ul className="space-y-2 text-gray-300 ml-4">
                  <li>• All payments are made in APT tokens through blockchain transactions</li>
                  <li>• Subscription periods begin immediately upon successful payment</li>
                  <li>• Access passes are represented as NFTs on the Aptos blockchain</li>
                  <li>• Prices are subject to change with notice</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Refund Policy</h4>
                <p className="text-gray-300 leading-relaxed">
                  Due to the digital nature of our services and blockchain transactions, <strong>all sales are final</strong>. 
                  Refunds are not provided except where required by law or in cases of technical failure on our part.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acceptable Use */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>6. Acceptable Use Policy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree NOT to use our platform to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-purple-300 mb-2">Prohibited Activities</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Violate any laws or regulations</li>
                    <li>• Harass, abuse, or harm others</li>
                    <li>• Share inappropriate content</li>
                    <li>• Attempt to hack or exploit the platform</li>
                    <li>• Create multiple accounts to bypass limits</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-purple-300 mb-2">Content Restrictions</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• No hate speech or discrimination</li>
                    <li>• No illegal or harmful activities</li>
                    <li>• No spam or commercial solicitation</li>
                    <li>• No impersonation of others</li>
                    <li>• No false or misleading information</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-400" />
                <span>7. Intellectual Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Our Content</h4>
                <p className="text-gray-300 leading-relaxed">
                  AstroProof owns all rights to the platform, including software, AI models, designs, and content. 
                  You may not copy, modify, or distribute our intellectual property without permission.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Your Content</h4>
                <p className="text-gray-300 leading-relaxed">
                  You retain ownership of content you create. By using our service, you grant us a license to 
                  process your content to provide the service, always respecting your privacy settings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Data */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span>8. Privacy and Data Protection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Your privacy is important to us. Our data practices are governed by our Privacy Policy, 
                which is incorporated into these terms. Key principles include:
              </p>
              <ul className="space-y-2 text-gray-300 ml-4">
                <li>• Client-side encryption of all sensitive data</li>
                <li>• No personal information stored on blockchain</li>
                <li>• Minimal data collection practices</li>
                <li>• Your right to control and delete your data</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Please review our <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link> for complete details.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-purple-400" />
                <span>9. Disclaimers and Limitations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-300 mb-3">Service Disclaimer</h4>
                <p className="text-red-200 text-sm leading-relaxed">
                  AstroProof provides spiritual guidance for entertainment and personal reflection only. 
                  Our AI responses are not predictions, professional advice, or guaranteed outcomes. 
                  Use your own judgment for important life decisions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Technical Limitations</h4>
                <ul className="space-y-2 text-gray-300 ml-4 text-sm">
                  <li>• Service availability may be interrupted for maintenance</li>
                  <li>• Blockchain transactions may fail due to network issues</li>
                  <li>• AI responses may vary in quality or relevance</li>
                  <li>• We cannot guarantee continuous service availability</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Limitation of Liability</h4>
                <p className="text-gray-300 leading-relaxed text-sm">
                  To the maximum extent permitted by law, AstroProof shall not be liable for any indirect, 
                  incidental, special, or consequential damages arising from your use of the platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserX className="h-5 w-5 text-purple-400" />
                <span>10. Termination</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Your Rights</h4>
                <p className="text-gray-300 leading-relaxed">
                  You may stop using our service at any time. Your encrypted data and NFTs remain under your control 
                  even if you stop using the platform.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-purple-300 mb-3">Our Rights</h4>
                <p className="text-gray-300 leading-relaxed">
                  We may suspend or terminate access for violations of these terms, illegal activities, 
                  or to protect our users and platform integrity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span>11. Changes to Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may update these terms from time to time. We will notify users of material changes by:
              </p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li>• Posting updated terms on our website</li>
                <li>• Displaying a notice on the platform</li>
                <li>• Sending email notifications (if contact provided)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Continued use of the platform after changes indicates acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5 text-purple-400" />
                <span>12. Governing Law and Disputes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                These terms are governed by the laws of the jurisdiction where AstroProof is incorporated. 
                Any disputes will be resolved through binding arbitration or in the courts of that jurisdiction.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these terms is found unenforceable, the remaining provisions remain in full force.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="astro-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-purple-400" />
                <span>13. Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions about these terms or our service, please contact us:
              </p>
              <div className="bg-muted/10 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <strong className="text-purple-300">Legal Questions:</strong> legal@astroproof.app
                </p>
                <p className="text-sm">
                  <strong className="text-purple-300">General Support:</strong> support@astroproof.app
                </p>
                <p className="text-sm">
                  <strong className="text-purple-300">Business Inquiries:</strong> hello@astroproof.app
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Links */}
          <Card className="astro-card text-center">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4 gradient-text">Related Documents</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/privacy" className="text-purple-400 hover:text-purple-300 font-medium">
                  Privacy Policy
                </Link>
                <Link href="/help" className="text-purple-400 hover:text-purple-300 font-medium">
                  Help Center
                </Link>
                <Link href="/contact" className="text-purple-400 hover:text-purple-300 font-medium">
                  Contact Us
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
