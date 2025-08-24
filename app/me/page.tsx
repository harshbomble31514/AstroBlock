'use client'

import React, { useState, useEffect } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { WalletConnect } from '@/components/WalletConnect'
import { ArrowLeft, Sparkles, ExternalLink, Eye, Calendar, Hash } from 'lucide-react'
import { TokenData, listMyTokens } from '@/lib/aptos'
import { formatDateTime, formatHash } from '@/lib/format'
import { Spinner } from '@/components/Spinner'

export default function MyProofsPage() {
  const { connected, account } = useWallet()
  const [tokens, setTokens] = useState<TokenData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (connected && account) {
      loadMyTokens()
    } else {
      setTokens([])
    }
  }, [connected, account])

  const loadMyTokens = async () => {
    if (!account?.address) return
    
    try {
      setLoading(true)
      setError(null)
      
      const myTokens = await listMyTokens(account.address)
      setTokens(myTokens)
    } catch (err) {
      console.error('Failed to load tokens:', err)
      setError('Failed to load your proofs')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              My Proofs
            </h1>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Wallet Connection */}
          {!connected && (
            <div className="mb-8">
              <WalletConnect />
            </div>
          )}

          {connected && (
            <>
              {/* Loading State */}
              {loading && (
                <Card className="astro-card">
                  <CardContent className="p-8 text-center">
                    <Spinner className="mx-auto mb-4" />
                    <p>Loading your proofs...</p>
                  </CardContent>
                </Card>
              )}

              {/* Error State */}
              {error && !loading && (
                <Card className="border-red-500/20 bg-red-500/10">
                  <CardContent className="p-6 text-center">
                    <p className="text-red-300 mb-4">{error}</p>
                    <Button onClick={loadMyTokens} variant="outline">
                      Retry
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Empty State */}
              {!loading && !error && tokens.length === 0 && (
                <Card className="astro-card">
                  <CardContent className="p-8 text-center">
                    <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Proofs Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You haven&apos;t created any astrology reading proofs yet.
                    </p>
                    <Link href="/">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Get Your First Reading
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Proofs List */}
              {!loading && tokens.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-muted-foreground">
                      You have {tokens.length} verified astrology reading{tokens.length === 1 ? '' : 's'}
                    </p>
                  </div>

                  <div className="grid gap-6">
                    {tokens.map((token) => (
                      <ProofCard key={token.tokenId} token={token} />
                    ))}
                  </div>

                  <div className="text-center">
                    <Link href="/">
                      <Button variant="outline">
                        Create Another Reading
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ProofCard({ token }: { token: TokenData }) {
  return (
    <Card className="astro-card hover:border-purple-400/40 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="truncate">{token.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {token.properties.created_at && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(token.properties.created_at)}</span>
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hashes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="text-muted-foreground flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>Session Hash</span>
            </label>
            <p className="font-mono text-xs break-all bg-muted/20 p-2 rounded mt-1">
              {formatHash(token.properties.session_hash)}
            </p>
          </div>
          <div>
            <label className="text-muted-foreground flex items-center space-x-1">
              <Hash className="h-3 w-3" />
              <span>Report Hash</span>
            </label>
            <p className="font-mono text-xs break-all bg-muted/20 p-2 rounded mt-1">
              {formatHash(token.properties.report_hash)}
            </p>
          </div>
        </div>

        {/* Description */}
        {token.description && (
          <p className="text-sm text-muted-foreground">
            {token.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Link href={`/v/${token.tokenId}`} className="flex-1">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Verify Proof
            </Button>
          </Link>
          <Link 
            href={`/v/${token.tokenId}`} 
            className="flex-1"
          >
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <ExternalLink className="mr-2 h-4 w-4" />
              View & Share
            </Button>
          </Link>
        </div>

        {/* Token ID */}
        <div className="pt-2 border-t border-muted/20">
          <label className="text-xs text-muted-foreground">Token ID</label>
          <p className="font-mono text-xs break-all text-muted-foreground">
            {token.tokenId}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
