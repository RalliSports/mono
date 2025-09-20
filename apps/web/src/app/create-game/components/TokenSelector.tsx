import { useState } from 'react'

interface Token {
  symbol: string
  name: string
  icon: string
  address: string
}

interface TokenSelectorProps {
  selectedToken: Token
  onChange: (token: Token) => void
}

// Mock token data
const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '💵',
    address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: '☀️',
    address: 'So11111111111111111111111111111111111111112',
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '💰',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    icon: '🚀',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    icon: '⚡',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
  },
]

export default function TokenSelector({ selectedToken, onChange }: TokenSelectorProps) {
  const [isCustomMode, setIsCustomMode] = useState(selectedToken.symbol !== 'USDC')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleCustom = () => {
    if (!isCustomMode) {
      // Switching to custom mode
      setIsCustomMode(true)
      setIsExpanded(true)
    } else {
      // Switching back to USDC
      setIsCustomMode(false)
      setIsExpanded(false)
      onChange(AVAILABLE_TOKENS[0]) // Default to USDC
    }
  }

  const handleTokenSelect = (token: Token) => {
    onChange(token)
    setIsExpanded(false)
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/20">
          <span className="text-lg">💰</span>
        </div>
        <div>
          <h3 className="text-white font-bold">Payment Token</h3>
          <p className="text-slate-400 text-xs">Choose token for contest entry fee</p>
        </div>
      </div>

      {/* Current Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gradient-to-br from-slate-700/80 to-slate-800/60 border-2 border-slate-600/40 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{selectedToken.icon}</span>
            <div>
              <div className="text-white font-bold">{selectedToken.symbol}</div>
              <div className="text-slate-400 text-xs">{selectedToken.name}</div>
            </div>
          </div>

          {/* Custom Token Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <span className="text-slate-400 text-sm">Custom</span>
            <div className="relative">
              <input type="checkbox" checked={isCustomMode} onChange={handleToggleCustom} className="sr-only" />
              <div
                className={`w-10 h-6 rounded-full transition-all duration-300 flex items-center ${
                  isCustomMode ? 'bg-gradient-to-r from-[#00CED1] to-blue-500' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                    isCustomMode ? 'ml-5' : 'ml-1'
                  }`}
                />
              </div>
            </div>
          </label>
        </div>

        {/* Expanded Token Selection */}
        {isCustomMode && (
          <div
            className={`transition-all duration-300 overflow-hidden ${
              isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2 p-3 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-lg border border-slate-600/30">
              <p className="text-slate-400 text-xs mb-3">Select a token:</p>

              {AVAILABLE_TOKENS.map((token) => (
                <button
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    selectedToken.address === token.address
                      ? 'bg-gradient-to-r from-[#00CED1]/20 to-blue-500/20 border border-[#00CED1]/30'
                      : 'bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/30'
                  }`}
                >
                  <span className="text-lg">{token.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="text-white font-semibold text-sm">{token.symbol}</div>
                    <div className="text-slate-400 text-xs">{token.name}</div>
                  </div>
                  {selectedToken.address === token.address && (
                    <div className="w-4 h-4 bg-gradient-to-r from-[#00CED1] to-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Expand/Collapse Button when in custom mode */}
        {isCustomMode && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center space-x-2 py-2 text-[#00CED1] hover:text-blue-400 transition-colors duration-200"
          >
            <span className="text-sm font-medium">{isExpanded ? 'Hide tokens' : 'Show tokens'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
