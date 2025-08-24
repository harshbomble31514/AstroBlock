'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sparkles, Lock, Save, Coins, Eye, EyeOff } from 'lucide-react'
import { formatBirthInfo } from '@/lib/format'
import { NormalizedInputs } from '@/lib/normalize'
import { ReadingResponse } from '@/lib/ai'
import { Spinner } from '@/components/Spinner'

interface ReadingCardProps {
  inputs: NormalizedInputs
  reading: ReadingResponse
  onSave: (passphrase: string) => Promise<void>
  onMint: () => Promise<void>
  canSave?: boolean
  canMint?: boolean
  saving?: boolean
  minting?: boolean
  saved?: boolean
  minted?: boolean
}

export function ReadingCard({
  inputs,
  reading,
  onSave,
  onMint,
  canSave = true,
  canMint = false,
  saving = false,
  minting = false,
  saved = false,
  minted = false,
}: ReadingCardProps) {
  const [passphrase, setPassphrase] = useState('')
  const [showPassphrase, setShowPassphrase] = useState(false)
  const [passphraseError, setPassphraseError] = useState('')

  const handleSave = async () => {
    if (!passphrase.trim()) {
      setPassphraseError('Please enter a passphrase')
      return
    }
    if (passphrase.length < 6) {
      setPassphraseError('Passphrase must be at least 6 characters')
      return
    }
    setPassphraseError('')
    await onSave(passphrase)
  }

  return (
    <div className="space-y-4">
      <Card className="reading-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span>Your Reading</span>
            {reading.fallback && (
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">
                Offline
              </span>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatBirthInfo(inputs.dob, inputs.time, inputs.place)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-line text-sm leading-relaxed">
              {reading.content}
            </div>
          </div>
        </CardContent>
      </Card>

      {canSave && !saved && (
        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Lock className="h-5 w-5 text-purple-400" />
              <span>Save Securely</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a passphrase to encrypt and save your reading.
              This passphrase is needed to decrypt your report later.
            </p>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Passphrase <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Input
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter a secure passphrase"
                  disabled={saving}
                  className="pr-10"
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
              {passphraseError && (
                <p className="text-red-400 text-sm">{passphraseError}</p>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={saving || !passphrase.trim()}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {saving ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Encrypting & Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Reading
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {saved && (
        <Card className="border-green-500/20 bg-green-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <Save className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-300">Reading Saved</p>
                <p className="text-sm text-green-200/80">
                  Your reading has been encrypted and saved securely
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {canMint && !minted && (
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Coins className="h-5 w-5 text-blue-400" />
              <span>Mint Proof NFT</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a permanent, verifiable proof of your reading on the Aptos blockchain.
              Only session and report hashes will be stored on-chain.
            </p>
            
            <Button
              onClick={onMint}
              disabled={minting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {minting ? (
                <>
                  <Spinner className="mr-2" size="sm" />
                  Minting NFT...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Mint Proof NFT
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {minted && (
        <Card className="border-blue-500/20 bg-blue-500/10">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Coins className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-blue-300">NFT Minted</p>
                <p className="text-sm text-blue-200/80">
                  Your proof has been minted on Aptos blockchain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground text-center">
        This reading is for entertainment purposes only and not intended as medical, legal, or financial advice.
      </p>
    </div>
  )
}
