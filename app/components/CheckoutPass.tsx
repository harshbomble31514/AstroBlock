'use client'

import React, { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { X, Crown, Star, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react'
import { transferAPT, mintAccessPass, getExplorerUrl } from '@/lib/aptos'
import { Account } from '@aptos-labs/ts-sdk'
import { toast } from '@/components/Toast'
import { Spinner } from '@/components/Spinner'
import gurusData from '@/data/gurus.json'

interface CheckoutPassProps {
  tier: 'ONE_GURU' | 'ALL_GURUS'
  guruSlug?: string
  onClose: () => void
  onSuccess: () => void
}

export function CheckoutPass({ tier, guruSlug, onClose, onSuccess }: CheckoutPassProps) {
  const { connected, account } = useWallet()
  const [step, setStep] = useState<'confirm' | 'paying' | 'minting' | 'success' | 'error'>('confirm')
  const [paymentTxHash, setPaymentTxHash] = useState<string>('')
  const [mintTxHash, setMintTxHash] = useState<string>('')
  const [error, setError] = useState<string>('')

  const guru = guruSlug ? gurusData.find(g => g.slug === guruSlug) : null
  const price = tier === 'ONE_GURU' 
    ? process.env.NEXT_PUBLIC_PRICE_ONE_GURU_APT || '0.20'
    : process.env.NEXT_PUBLIC_PRICE_ALL_GURUS_APT || '0.50'
  
  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS || ''
  const passHours = parseInt(process.env.NEXT_PUBLIC_DAYPASS_HOURS || '24')

  const handlePayment = async () => {
    if (!account?.address || !treasuryAddress) {
      setError('Wallet not connected or treasury address not configured')
      setStep('error')
      return
    }

    try {
      setStep('paying')
      setError('')

      // For demo mode, we'll use a simplified approach
      // In production, this should use proper wallet signing
      const accountObj = {
        address: account.address,
        publicKey: account.publicKey,
        // Mock account object for demo
        signTransaction: async (txn: any) => {
          throw new Error('Demo mode: Wallet signing not implemented')
        }
      }

      // Step 1: Transfer APT to treasury (demo mode)
      // In production, this would be a real transaction
      const txHash = `demo_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      setPaymentTxHash(txHash)
      
      toast({
        title: 'Payment Successful',
        description: 'Now minting your access pass...',
      })

      setStep('minting')

      // Step 2: Mint access pass (demo mode)
      const now = new Date()
      const expiresAt = new Date(now.getTime() + passHours * 60 * 60 * 1000)

      // In production, this would mint a real NFT
      const mintTx = `demo_mint_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Simulate minting delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      setMintTxHash(mintTx)
      setStep('success')

      toast({
        title: 'Access Pass Minted!',
        description: 'Your access pass has been created successfully.',
      })

      // Store payment info in localStorage for verification page
      if (typeof window !== 'undefined') {
        const passInfo = {
          paymentTxHash: txHash,
          mintTxHash: mintTx,
          tier,
          guruSlug: guruSlug || '',
          timestamp: now.toISOString(),
        }
        localStorage.setItem(`pass_${mintTx}`, JSON.stringify(passInfo))
      }

    } catch (err: any) {
      console.error('Checkout failed:', err)
      setError(err.message || 'Transaction failed. Please try again.')
      setStep('error')
      
      toast({
        title: 'Transaction Failed',
        description: err.message || 'Please try again',
        variant: 'destructive',
      })
    }
  }

  const handleSuccess = () => {
    onSuccess()
    onClose()
  }

  if (!connected) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="astro-card border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-400" />
              <span>Connect Wallet Required</span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Please connect your Aptos wallet to purchase an access pass.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="astro-card border-purple-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {tier === 'ALL_GURUS' ? (
                <Star className="h-5 w-5 text-purple-400" />
              ) : (
                <Crown className="h-5 w-5 text-purple-400" />
              )}
              <span>
                {tier === 'ALL_GURUS' ? 'All Gurus Day Pass' : 'One Guru Day Pass'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step === 'confirm' && (
            <>
              <Card className="bg-purple-500/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Purchase Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Pass Type:</span>
                    <span className="font-medium">
                      {tier === 'ALL_GURUS' ? 'All Gurus Access' : guru?.name || 'One Guru Access'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{passHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Benefits:</span>
                    <span className="font-medium">
                      {tier === 'ALL_GURUS' ? 'All Gurus' : 'Selected Guru'} - Unlimited Chats
                    </span>
                  </div>
                  <div className="border-t border-purple-500/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-purple-300">{price} APT</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-300 mb-1">Two-Step Process</p>
                    <p className="text-amber-200/80">
                      This is an MVP two-transaction flow: first payment, then minting. 
                      Your access pass will be created as an NFT on Aptos blockchain.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Pay {price} APT & Mint Pass
              </Button>
            </>
          )}

          {step === 'paying' && (
            <div className="text-center py-8">
              <Spinner className="mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">
                Transferring {price} APT to treasury...
              </p>
            </div>
          )}

          {step === 'minting' && (
            <div className="text-center py-8">
              <Spinner className="mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Minting Access Pass</h3>
              <p className="text-sm text-muted-foreground">
                Creating your NFT access pass on Aptos blockchain...
              </p>
              {paymentTxHash && (
                <div className="mt-4">
                  <a
                    href={getExplorerUrl(paymentTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-1"
                  >
                    <span>View Payment Transaction</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-green-300">Success!</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Your {tier === 'ALL_GURUS' ? 'All Gurus' : guru?.name} access pass has been minted successfully.
              </p>
              
              <div className="space-y-3">
                {paymentTxHash && (
                  <a
                    href={getExplorerUrl(paymentTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Payment
                    </Button>
                  </a>
                )}
                
                {mintTxHash && (
                  <a
                    href={getExplorerUrl(mintTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Access Pass
                    </Button>
                  </a>
                )}

                <Button
                  onClick={handleSuccess}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Start Chatting
                </Button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-red-300">Transaction Failed</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {error}
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setStep('confirm')}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
