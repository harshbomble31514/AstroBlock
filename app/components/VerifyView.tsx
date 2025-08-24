'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, Shield, CheckCircle, XCircle, Clock } from 'lucide-react'
import { TokenData, readToken, getExplorerUrl, getTokenUrl } from '@/lib/aptos'
import { maskAddress, formatDateTime, formatHash } from '@/lib/format'
import { Spinner } from '@/components/Spinner'

interface VerifyViewProps {
  tokenId: string
}

export function VerifyView({ tokenId }: VerifyViewProps) {
  const [tokenData, setTokenData] = useState<TokenData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTokenData()
  }, [tokenId])

  const loadTokenData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await readToken(tokenId)
      if (!data) {
        setError('Token not found or invalid token ID')
        return
      }
      
      setTokenData(data)
    } catch (err) {
      console.error('Failed to load token data:', err)
      setError('Failed to load token data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="astro-card">
        <CardContent className="p-8 text-center">
          <Spinner className="mx-auto mb-4" />
          <p>Loading verification data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error || !tokenData) {
    return (
      <Card className="border-red-500/20 bg-red-500/10">
        <CardContent className="p-8 text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            Verification Failed
          </h3>
          <p className="text-red-200/80">
            {error || 'Token not found'}
          </p>
          <Button
            onClick={loadTokenData}
            variant="outline"
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isValidProof = tokenData.properties.session_hash && 
                      tokenData.properties.report_hash && 
                      tokenData.properties.created_at &&
                      tokenData.uri

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <Card className={`border ${isValidProof ? 'border-green-500/20 bg-green-500/10' : 'border-amber-500/20 bg-amber-500/10'}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            {isValidProof ? (
              <CheckCircle className="h-8 w-8 text-green-400" />
            ) : (
              <XCircle className="h-8 w-8 text-amber-400" />
            )}
            <div>
              <h3 className={`font-semibold ${isValidProof ? 'text-green-300' : 'text-amber-300'}`}>
                {isValidProof ? 'Verification Successful' : 'Incomplete Data'}
              </h3>
              <p className={`text-sm ${isValidProof ? 'text-green-200/80' : 'text-amber-200/80'}`}>
                {isValidProof 
                  ? 'On-chain data present & consistent'
                  : 'Some verification data is missing'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Information */}
      <Card className="astro-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-purple-400" />
            <span>Proof Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Token ID
              </label>
              <p className="font-mono text-sm break-all">
                {tokenId}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Owner
              </label>
              <p className="font-mono text-sm">
                {maskAddress(tokenData.owner)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Collection
              </label>
              <p className="text-sm">
                {tokenData.collection}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm">
                {tokenData.properties.created_at ? 
                  formatDateTime(tokenData.properties.created_at) : 
                  'Unknown'
                }
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Session Hash
              </label>
              <p className="font-mono text-sm break-all bg-muted/20 p-2 rounded">
                {tokenData.properties.session_hash || 'Not available'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Report Hash
              </label>
              <p className="font-mono text-sm break-all bg-muted/20 p-2 rounded">
                {tokenData.properties.report_hash || 'Not available'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Encrypted Report URI
              </label>
              <p className="font-mono text-xs break-all bg-muted/20 p-2 rounded">
                {tokenData.uri}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <a
              href={getTokenUrl(tokenId)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            </a>
            {tokenData.transactionHash && (
              <a
                href={getExplorerUrl(tokenData.transactionHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  View Transaction
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Note */}
      <Card className="border-blue-500/20 bg-blue-500/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-300">
                Privacy Protected
              </p>
              <p className="text-xs text-blue-200/80 mt-1">
                Only anonymous fingerprints are stored on-chain. 
                The full reading is encrypted and can only be unlocked by the owner.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
