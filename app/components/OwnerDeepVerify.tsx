'use client'

import React, { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react'
import { TokenData } from '@/lib/aptos'
import { downloadAndDecrypt } from '@/lib/storage'
import { reportHash } from '@/lib/hash'
import { toast } from '@/components/Toast'
import { Spinner } from '@/components/Spinner'

interface OwnerDeepVerifyProps {
  tokenData: TokenData
}

interface VerificationResult {
  success: boolean
  message: string
  readingContent?: string
}

export function OwnerDeepVerify({ tokenData }: OwnerDeepVerifyProps) {
  const { connected, account } = useWallet()
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const isOwner = connected && 
    account?.address && 
    account.address.toLowerCase() === tokenData.owner.toLowerCase()

  const handleDeepVerify = async () => {
    if (!passphrase.trim()) {
      toast({
        title: 'Passphrase Required',
        description: 'Please enter your passphrase to decrypt the reading.',
        variant: 'destructive',
      })
      return
    }

    try {
      setVerifying(true)
      setResult(null)

      // Download and decrypt the report
      const decryptedData = await downloadAndDecrypt(tokenData.uri, passphrase)
      
      // Extract the reading content
      const readingContent = decryptedData.reading
      
      // Recompute the report hash
      const computedHash = reportHash(readingContent)
      const storedHash = tokenData.properties.report_hash
      
      if (computedHash === storedHash) {
        setResult({
          success: true,
          message: 'Perfect match! The reading is authentic and unmodified.',
          readingContent,
        })
        toast({
          title: 'Verification Successful',
          description: 'The reading matches the on-chain hash perfectly.',
        })
      } else {
        setResult({
          success: false,
          message: 'Hash mismatch. The reading may have been modified or corrupted.',
        })
        toast({
          title: 'Verification Failed',
          description: 'The reading does not match the on-chain hash.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Deep verification failed:', error)
      setResult({
        success: false,
        message: 'Failed to decrypt or verify the reading. Check your passphrase.',
      })
      toast({
        title: 'Verification Failed',
        description: 'Failed to decrypt the reading. Please check your passphrase.',
        variant: 'destructive',
      })
    } finally {
      setVerifying(false)
    }
  }

  if (!connected) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/10">
        <CardContent className="p-6 text-center">
          <Lock className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-amber-300 mb-2">
            Connect Wallet for Deep Verification
          </h3>
          <p className="text-sm text-amber-200/80">
            Connect your wallet to perform deep verification if you own this proof.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!isOwner) {
    return (
      <Card className="border-gray-500/20 bg-gray-500/10">
        <CardContent className="p-6 text-center">
          <Lock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-300 mb-2">
            Owner-Only Verification
          </h3>
          <p className="text-sm text-gray-200/80">
            Deep verification is only available to the proof owner.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500/20 bg-green-500/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-green-400" />
          <span className="text-green-300">Owner Deep Verification</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-green-200/80">
          As the owner, you can decrypt your reading and verify it matches the on-chain hash.
        </p>

        {!result && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-green-300">
                Enter your passphrase
              </label>
              <div className="relative">
                <Input
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter the passphrase you used to save this reading"
                  disabled={verifying}
                  className="pr-10 bg-green-500/10 border-green-500/30"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                >
                  {showPassphrase ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDeepVerify}
              disabled={verifying || !passphrase.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {verifying ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Reading
                </>
              )}
            </Button>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              result.success 
                ? 'border-green-500/30 bg-green-500/20' 
                : 'border-red-500/30 bg-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
                <Badge variant={result.success ? 'default' : 'destructive'}>
                  {result.success ? 'Verified ✓' : 'Failed ✗'}
                </Badge>
              </div>
              <p className={`text-sm ${
                result.success ? 'text-green-200' : 'text-red-200'
              }`}>
                {result.message}
              </p>
            </div>

            {result.success && result.readingContent && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-green-300">
                  Decrypted Reading
                </label>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {result.readingContent}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={() => {
                setResult(null)
                setPassphrase('')
              }}
              variant="outline"
              className="w-full"
            >
              Verify Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
