'use client'

import React, { useState } from 'react'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { Button } from '@/components/ui/Button'
import { Wallet, Copy } from 'lucide-react'
import { maskAddress } from '@/lib/format'
import { toast } from '@/components/Toast'

export function WalletConnect() {
  const { 
    connected, 
    account, 
    connect, 
    disconnect, 
    wallets 
  } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      // Check if wallets are available
      if (!wallets || wallets.length === 0) {
        toast({
          title: 'No Wallets Found',
          description: 'Please install Petra wallet extension to connect.',
          variant: 'destructive',
        })
        return
      }

      // Find Petra wallet first, or use first available
      const petraWallet = wallets.find(wallet => 
        wallet.name?.toLowerCase().includes('petra')
      )
      const targetWallet = petraWallet || wallets[0]
      
      if (!targetWallet) {
        toast({
          title: 'No Compatible Wallet',
          description: 'No compatible wallet found.',
          variant: 'destructive',
        })
        return
      }
      
      await connect(targetWallet.name)
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected to ${targetWallet.name}`,
      })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast({
        title: 'Connection Failed',
        description: 'Please make sure you have a compatible wallet installed (Petra recommended).',
        variant: 'destructive',
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected.',
      })
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address)
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard.',
      })
    }
  }

  if (!connected || !account) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        className="royal-button w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg"
        size="sm"
      >
        <Wallet className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    )
  }

  return (
    <div className="flex items-center space-x-1 sm:space-x-2">
      <span className="text-xs sm:text-sm text-muted-foreground">
        {maskAddress(account.address)}
      </span>
      <Button
        size="sm"
        variant="ghost"
        onClick={copyAddress}
        className="p-1 sm:p-2"
      >
        <Copy className="h-3 sm:h-4 w-3 sm:w-4" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDisconnect}
        className="text-xs sm:text-sm px-2 sm:px-3"
      >
        <span className="hidden sm:inline">Disconnect</span>
        <span className="sm:hidden">✕</span>
      </Button>
    </div>
  )
}
