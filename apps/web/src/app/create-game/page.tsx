'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSessionToken } from '@/hooks/use-session'
import { toast, ToastContainer } from 'react-toastify'
import { useParaWalletBalance } from "@/hooks/use-para-wallet-balance";
import { useRouter } from 'next/navigation';

//check if para is connected else kick back to /signin

export default function CreateGame() {
  const router = useRouter();

  // Para wallet balance hook
  const { isConnected } = useParaWalletBalance();
  const { session } = useSessionToken();

  useEffect(() => {
    if (!isConnected) {
      // Redirect to sign-in page with a callback to return to /create-game
      router.push(`/signin?callbackUrl=/create-game`);
    }
  }, [isConnected, router]);

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [gameSettings, setGameSettings] = useState({
    title: '',
    depositAmount: 25,
    maxParticipants: 8,
    matchupGroup: '',
    isPrivate: false,
    //TODO: Update depositToken when live
    depositToken: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    type: 'limited',
    userControlType: 'none',
    gameMode: '550e8400-e29b-41d4-a716-446655440020',
    maxBets: 10, // Default max bets
  })

  const isValidUUID = (uuid: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)

  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    if (!gameSettings.title.trim()) errors.title = 'Title is required.'
    if (!gameSettings.matchupGroup.trim()) errors.matchupGroup = 'Matchup Group is required.'
    if (gameSettings.depositAmount < 5 || gameSettings.depositAmount > 500)
      errors.depositAmount = 'Deposit must be between $5 and $500.'
    if (gameSettings.maxParticipants < 2 || gameSettings.maxParticipants > 20)
      errors.maxParticipants = 'Participants must be between 2 and 20.'
    if (gameSettings.maxBets < 1 || gameSettings.maxBets > 50) errors.maxBets = 'Max bets must be between 1 and 50.'
    if (!['1v1', 'limited', 'unlimited'].includes(gameSettings.type)) errors.type = 'Invalid contest type.'
    if (!['none', 'whitelist', 'blacklist'].includes(gameSettings.userControlType))
      errors.userControlType = 'Invalid user control type.'
    if (!gameSettings.gameMode || !isValidUUID(gameSettings.gameMode))
      errors.gameMode = 'Game Mode ID must be a valid UUID.'

    return errors
  }

  const handleInputChange = (field: string, value: any) => {
    setGameSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreateContest = async () => {
  const errors = validateForm()
  setFormErrors(errors)

  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => {
      toast.error(message)
    })
    return
  }

  const apiData = {
    title: gameSettings.title,
    depositAmount: gameSettings.depositAmount,
    currency: 'USD',
    maxParticipants: gameSettings.maxParticipants,
    maxBets: gameSettings.maxBets,
    matchupGroup: gameSettings.matchupGroup,
    //TODO: Update depositToken when live
    depositToken: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    isPrivate: gameSettings.isPrivate,
    type: gameSettings.type,
    userControlType: gameSettings.userControlType,
    gameModeId: gameSettings.gameMode,
  }

  try {
    const response = await fetch('/api/create-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-para-session': session || '',
      },
      body: JSON.stringify(apiData),
    })

    const result = await response.json()

    if (response.ok) {
      toast.success(
        <div>
          Contest created successfully! Transaction ID: 
          <a 
            href={`https://explorer.solana.com/tx/${result.txnId}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#00CED1', textDecoration: 'underline', marginLeft: '5px' }}
          >
            View Transaction
          </a>
        </div>
      );
      setGameSettings({
        title: '',
        depositAmount: 25,
        maxParticipants: 8,
        matchupGroup: '',
        isPrivate: false,
        //TODO: Update depositToken when live
        depositToken: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        type: 'limited',
        userControlType: 'none',
        gameMode: '550e8400-e29b-41d4-a716-446655440020',
        maxBets: 10,
      })
    } else {
      if (Array.isArray(result.message)) {
        result.message.forEach((msg: string) => toast.error(msg))
      } else {
        toast.error(result.message || 'Failed to create contest.')
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    toast.error('Unexpected error. Please try again.')
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #1e293b 0%, #ffab91 50%, #ff8e53 100%);
          height: 8px;
          border-radius: 8px;
          outline: none;
          opacity: 0.9;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider:hover {
          background: linear-gradient(to right, #334155 0%, #ff8e53 50%, #ff7043 100%);
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 142, 83, 0.3);
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffab91, #ff8e53);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(255, 171, 145, 0.4),
            0 0 0 1px rgba(255, 171, 145, 0.6);
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow:
            0 6px 20px rgba(255, 171, 145, 0.6),
            0 0 0 2px rgba(255, 171, 145, 0.8);
          background: linear-gradient(135deg, #ff8e53, #ff7043);
        }

        .contest-legs-slider {
          background: linear-gradient(to right, #1e293b 0%, #34d399 50%, #10b981 100%);
          height: 8px;
          border-radius: 8px;
          outline: none;
          opacity: 0.9;
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .contest-legs-slider:hover {
          background: linear-gradient(to right, #334155 0%, #10b981 50%, #059669 100%);
          box-shadow:
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(16, 185, 129, 0.3);
        }

        .contest-legs-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow:
            0 4px 12px rgba(16, 185, 129, 0.4),
            0 0 0 1px rgba(16, 185, 129, 0.6);
          transition: all 0.3s ease;
        }

        .contest-legs-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: linear-gradient(135deg, #34d399, #10b981);
          box-shadow:
            0 6px 20px rgba(16, 185, 129, 0.6),
            0 0 0 2px rgba(16, 185, 129, 0.8);
        }
      `}</style>

      <div className="max-w-md mx-auto space-y-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/20 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent mb-3">
            Create Contest
          </h1>
          <p className="text-slate-400 text-lg">Set up your betting challenge</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Game Title */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-xl flex items-center justify-center border border-[#00CED1]/30 shadow-lg">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Contest Title</h3>
                <p className="text-slate-400 text-sm">Give your contest a memorable name</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={gameSettings.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter contest title..."
                className="w-full bg-gradient-to-br from-slate-700/80 to-slate-800/60 border-2 border-slate-600/40 rounded-xl px-5 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-[#00CED1]/70 focus:ring-4 focus:ring-[#00CED1]/10 focus:bg-slate-700/90 transition-all duration-300 text-lg font-medium shadow-inner"
                maxLength={50}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                {gameSettings.title.length}/50
              </div>
            </div>
            {gameSettings.title.length > 0 && (
              <div className="mt-3 p-3 bg-[#00CED1]/5 border border-[#00CED1]/20 rounded-lg">
                <p className="text-[#00CED1] text-sm font-medium">Preview: "{gameSettings.title}"</p>
              </div>
            )}
          </div>

          {/* Deposit Amount */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-[#00CED1]/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1]/20 to-blue-500/10 rounded-lg flex items-center justify-center border border-[#00CED1]/20">
                <span className="text-lg">💰</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Deposit Amount</h3>
                <p className="text-slate-400 text-xs">Entry fee per player</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-[#00CED1] font-bold text-lg">$</span>
              <input
                type="range"
                value={gameSettings.depositAmount}
                onChange={(e) => handleInputChange('depositAmount', parseInt(e.target.value))}
                min="5"
                max="500"
                step="5"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-[#00CED1] font-bold text-xl min-w-[3rem] text-center">
                ${gameSettings.depositAmount}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>$5</span>
              <span>$500</span>
            </div>
          </div>

          {/* Max Participants */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-orange-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-orange-400/10 rounded-lg flex items-center justify-center border border-orange-400/20">
                <span className="text-lg">👥</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Max Participants</h3>
                <p className="text-slate-400 text-xs">Maximum participants</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="range"
                value={gameSettings.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value))}
                min="2"
                max="20"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-orange-400 font-bold text-xl min-w-[2.5rem] text-center">
                {gameSettings.maxParticipants}
              </span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>2</span>
              <span>20</span>
            </div>
          </div>

          {/* Max Bets */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-teal-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500/20 to-teal-400/10 rounded-lg flex items-center justify-center border border-teal-400/20">
                <span className="text-lg">🎲</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Max Bets</h3>
                <p className="text-slate-400 text-xs">Maximum bets allowed per participant</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="range"
                value={gameSettings.maxBets}
                onChange={(e) => handleInputChange('maxBets', parseInt(e.target.value))}
                min="1"
                max="50"
                step="1"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-teal-400 font-bold text-xl min-w-[2.5rem] text-center">{gameSettings.maxBets}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>1</span>
              <span>50</span>
            </div>
          </div>

          {/* Matchup Group */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-lg flex items-center justify-center border border-cyan-400/20">
                <span className="text-lg">📅</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Matchup Group</h3>
                <p className="text-slate-400 text-xs">Contest time period</p>
              </div>
            </div>
            <input
              type="text"
              value={gameSettings.matchupGroup}
              onChange={(e) => handleInputChange('matchupGroup', e.target.value)}
              placeholder="Enter matchup group (e.g. Week 3)"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
            />
          </div>

          {/* Type */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-amber-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-400/10 rounded-lg flex items-center justify-center border border-amber-400/20">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Type</h3>
                <p className="text-slate-400 text-xs">Contest entry type</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInputChange('type', 'limited')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.type === 'limited'
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🚪</span>
                  <div className="text-white font-semibold text-sm">Limited</div>
                </div>
              </button>
              <button
                onClick={() => handleInputChange('type', 'unlimited')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.type === 'unlimited'
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🌐</span>
                  <div className="text-white font-semibold text-sm">Unlimited</div>
                </div>
              </button>
            </div>
          </div>

          {/* User Control Type */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-indigo-400/10 rounded-lg flex items-center justify-center border border-indigo-400/20">
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <h3 className="text-white font-bold">User Control Type</h3>
                <p className="text-slate-400 text-xs">Access control method</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInputChange('userControlType', 'none')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.userControlType === 'none'
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🔓</span>
                  <div className="text-white font-semibold text-sm">None</div>
                </div>
              </button>
              <button
                onClick={() => handleInputChange('userControlType', 'whitelist')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.userControlType === 'whitelist'
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">📋</span>
                  <div className="text-white font-semibold text-sm">Whitelist</div>
                </div>
              </button>
            </div>
          </div>

          {/* Privacy Setting */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-lg flex items-center justify-center border border-purple-400/20">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Privacy Setting</h3>
                <p className="text-slate-400 text-xs">Who can join this contest</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleInputChange('isPrivate', false)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.isPrivate === false
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🌍</span>
                  <div className="text-white font-semibold text-sm">Public</div>
                  <div className="text-slate-400 text-xs">Anyone can join</div>
                </div>
              </button>
              <button
                onClick={() => handleInputChange('isPrivate', true)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  gameSettings.isPrivate === true
                    ? 'border-[#00CED1] bg-[#00CED1]/10 shadow-lg'
                    : 'border-slate-600/30 bg-slate-700/30 hover:border-slate-500/50'
                }`}
              >
                <div className="text-center">
                  <span className="text-xl block mb-1">🔒</span>
                  <div className="text-white font-semibold text-sm">Private</div>
                  <div className="text-slate-400 text-xs">Invite only</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Prize Pool Summary */}
        <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-[#00CED1]/30 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">Contest Summary</h3>
              <p className="text-slate-400 text-sm">Total prize pool and details</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#00CED1] to-blue-400 bg-clip-text text-transparent">
                ${gameSettings.depositAmount * gameSettings.maxParticipants}
              </div>
              <div className="text-xs text-slate-400">Total prize pool</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center mb-6">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-orange-400 font-bold text-lg">{gameSettings.maxParticipants}</div>
              <div className="text-slate-400 text-xs">Max Participants</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-pink-400 font-bold text-lg">{gameSettings.gameMode}</div>
              <div className="text-slate-400 text-xs">Game Mode</div>
            </div>
          </div>

          <button
            onClick={handleCreateContest}
            className="relative w-full bg-gradient-to-r from-[#00CED1] to-blue-500 hover:from-[#00CED1]/90 hover:to-blue-500/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg overflow-hidden group"
          >
            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>Create Contest</span>
            </span>
          </button>
        </div>

        {/* Back Navigation */}
        <div className="text-center">
          <Link
            href="/main"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-[#00CED1] transition-colors duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
