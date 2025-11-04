'use client'

import React from 'react' // Explicitly import React for ReactNode type
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ParaProvider } from '@getpara/react-sdk'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import '@getpara/react-sdk/styles.css'
import { ENVIRONMENT, API_KEY } from '@/constants-client'

const queryClient = new QueryClient()

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaProvider
        paraClientConfig={{
          apiKey: API_KEY, // Ensure this matches your API key
          env: ENVIRONMENT, // Updated to match production environment
        }}
        config={{
          appName: 'Ralli',
        }}
        paraModalConfig={{
          logo: '/images/logo-cream-bg.svg',
          oAuthMethods: ['GOOGLE'],
          authLayout: ['AUTH:FULL', 'EXTERNAL:CONDENSED'],
        }}
        externalWalletConfig={{
          appUrl: 'https://ralli.bet/', // Ensure this matches your app's real URL
          wallets: ['METAMASK', 'PHANTOM', 'SOLFLARE', 'BACKPACK'],
          includeWalletVerification: true,
          solanaConnector: {
            config: {
              endpoint: 'https://api.devnet.solana.com', // Ensure this matches your desired cluster
              chain: WalletAdapterNetwork.Devnet, // Devnet | Mainnet | Testnet
            },
          },
        }}
      >
        {children}
      </ParaProvider>
    </QueryClientProvider>
  )
}
