'use client'

import { useModal, useAccount, useWallet, useClient } from '@getpara/react-sdk'
import { useMemo } from 'react'
import { Copy, Zap } from 'lucide-react'

function ellipsify(address?: string, start = 4, end = 4) {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function ParaButton() {
  const { openModal } = useModal()
  const account = useAccount()
  const { data: wallet } = useWallet()
  const para = useClient()

  const displayAddress = useMemo(() => {
    if (!wallet || !para) return ''
    return para.getDisplayAddress(wallet.id, {
      truncate: false,
      addressType: wallet.type,
    })
  }, [wallet, para])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isConnected = account?.isConnected && displayAddress

  return (
    <div className="relative group">
      <button
        onClick={() => openModal()}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300 ${
          isConnected
            ? 'bg-gradient-to-r from-teal-500/20 to-teal-400/20 hover:from-teal-500/30 hover:to-teal-400/30 border border-teal-400/40 backdrop-blur-sm hover:scale-105 hover:shadow-md hover:shadow-teal-500/25'
            : 'bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 hover:from-orange-400 hover:via-teal-500 hover:to-stone-300 text-slate-800 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden'
        }`}
      >
        {/* Icon or status dot */}
        <div className="relative">
          {isConnected ? (
            <>
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-teal-400 rounded-full animate-ping opacity-75"></div>
            </>
          ) : (
            <Zap className="w-4 h-4 animate-bounce text-slate-700" />
          )}
        </div>

        {/* Button text */}
        <div className="flex flex-col items-start">
          {isConnected ? (
            <>
              <span className="text-xs font-semibold text-teal-700">CONNECTED</span>
              <code className="text-[10px] text-teal-600 font-mono bg-teal-500/10 px-1.5 py-0.5 rounded-md">
                {ellipsify(displayAddress)}
              </code>
            </>
          ) : (
            <>
              <span className="text-sm font-bold text-slate-800 leading-none">Connect Wallet</span>
              <span className="text-[10px] opacity-80 font-medium text-slate-700">Sign in with Para</span>
            </>
          )}
        </div>

        {/* Copy icon */}
        {isConnected && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(displayAddress)
            }}
            className="p-1 hover:bg-teal-500/20 rounded-md transition-colors duration-200"
            title="Copy address"
          >
            <Copy className="w-3.5 h-3.5 text-teal-400" />
          </button>
        )}

        {/* Glow effect */}
        {!isConnected && (
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-300 via-teal-400 to-stone-200 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-slate-800/90 text-stone-100 text-[10px] px-2 py-1 rounded-md whitespace-nowrap">
          {isConnected ? 'Click to manage wallet' : 'Connect to start betting'}
        </div>
      </div>
    </div>
  )
}
