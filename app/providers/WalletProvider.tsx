'use client'

import React from 'react'
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react'
import { Network } from '@aptos-labs/ts-sdk'

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = (process.env.NEXT_PUBLIC_APTOS_NETWORK as Network) || Network.TESTNET

  return (
    <AptosWalletAdapterProvider
      plugins={[]}
      autoConnect={false}
      dappConfig={{
        network,
        aptosConnectDappId: 'astroblock-app',
      }}
      onError={(error) => {
        console.error('Wallet connection error:', error)
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  )
}
