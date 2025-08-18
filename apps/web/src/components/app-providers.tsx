// components/app-providers.tsx
'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'
import { ClusterProvider } from '@/components/cluster/cluster-data-access'
import { SolanaProvider } from '@/components/solana/solana-provider'
import { Providers } from './para-provider'
import { UserDataProvider } from '@/providers/user-data-provider'
import React from 'react'
import { ToastProvider } from './ui/toast'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ToastProvider>
      <ClusterProvider>
        <SolanaProvider>
          <ReactQueryProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Providers>
                <UserDataProvider>{children}</UserDataProvider>
              </Providers>
            </ThemeProvider>
          </ReactQueryProvider>
        </SolanaProvider>
      </ClusterProvider>
    </ToastProvider>
  )
}
