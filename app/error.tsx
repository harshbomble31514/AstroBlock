'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, MessageCircle, Bug } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to our error reporting service
    console.error('Application error:', error)
  }, [error])

  const errorDetails = {
    message: error.message || 'An unexpected error occurred',
    stack: error.stack,
    digest: error.digest,
    timestamp: new Date().toISOString(),
  }

  const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
  const isBlockchainError = error.message.includes('wallet') || error.message.includes('transaction')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Error Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <AlertTriangle className="h-24 w-24 text-red-400 animate-pulse" />
            <div className="absolute inset-0 animate-ping">
              <AlertTriangle className="h-24 w-24 text-red-400/20" />
            </div>
          </div>
        </div>

        {/* Main Error Card */}
        <Card className="astro-card mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold gradient-text mb-2">
              Oops! Something Went Wrong
            </CardTitle>
            <p className="text-gray-300">
              The cosmic energies seem a bit disrupted. Don't worry, we're here to help you get back on track.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Type Specific Messages */}
            {isNetworkError && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-300 mb-2">Network Connection Issue</h4>
                <p className="text-blue-200 text-sm">
                  It looks like there's a connection problem. Please check your internet connection and try again.
                </p>
              </div>
            )}

            {isBlockchainError && (
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-purple-300 mb-2">Blockchain Connection Issue</h4>
                <p className="text-purple-200 text-sm">
                  There seems to be an issue with your wallet or the blockchain connection. 
                  Please check your wallet is connected and try again.
                </p>
              </div>
            )}

            {/* Generic Error Info */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">Error Details</h4>
              <p className="text-red-200 text-sm mb-2">{errorDetails.message}</p>
              {errorDetails.digest && (
                <p className="text-red-300 text-xs font-mono">
                  Error ID: {errorDetails.digest}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={reset}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="astro-card mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" className="w-full">
                  <Bug className="mr-2 h-4 w-4" />
                  Get Help
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Report Error */}
        <Card className="astro-card">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Still Having Issues?</h3>
            <p className="text-gray-300 text-sm mb-4">
              If this error persists, please report it to our support team. 
              We'll investigate and fix it as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:support@astroproof.app?subject=Error Report&body=Error Details:%0A%0AMessage: ${encodeURIComponent(errorDetails.message)}%0ATimestamp: ${encodeURIComponent(errorDetails.timestamp)}%0ADigest: ${encodeURIComponent(errorDetails.digest || 'N/A')}%0A%0APlease describe what you were doing when this error occurred:`}
                className="inline-block"
              >
                <Button size="sm" variant="outline">
                  <Bug className="mr-2 h-3 w-3" />
                  Report Error
                </Button>
              </a>
              <Link href="/contact">
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details (Collapsible) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8">
            <summary className="cursor-pointer text-gray-400 text-sm mb-2">
              Technical Details (Development)
            </summary>
            <Card className="astro-card">
              <CardContent className="p-4">
                <pre className="text-xs text-gray-300 overflow-auto bg-black/20 p-3 rounded">
                  {JSON.stringify(errorDetails, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </details>
        )}
      </div>
    </div>
  )
}
