"use client";
import { useParaWalletBalance } from '@/hooks/use-para-wallet-balance'

import { useState, useEffect } from "react";

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  icon: string;
  href: string;
  external?: boolean;
  className?: string;
}

interface NavSection {
  section: string;
  items: NavItem[];
}


export default function SidebarNav({ isOpen, onClose,
   }: SidebarNavProps) {
  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  
  
  
    // Para wallet balance hook
    const { isConnected, balances, isLoading: balanceLoading, error: balanceError } = useParaWalletBalance()
  
    // Format balance for display
    const formatBalance = (amount: number) => {
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

  const navItems: NavSection[] = [
    {
      section: "Game",
      items: [
        { name: "Create Game", icon: "🎯", href: "/create-game" },
        // { name: "My Games", icon: "🎮", href: "/my-games" },
        { name: "Add Funds", icon: "💳", href: "/add-funds" },
        // { name: "Leaderboard", icon: "🏆", href: "/leaderboard" },
        // { name: "Transaction History", icon: "💰", href: "/transactions" },
      ],
    },
    {
      section: "Account",
      items: [
        { name: "Sign In", icon: "🔑", href: "/signin" },
        // { name: "Sign Up", icon: "✨", href: "/signup" },
        { name: "Profile", icon: "👤", href: "/profile" },
        {
          name: "Logout",
          icon: "🚪",
          href: "/logout",
          className: "text-red-400 hover:text-red-300",
        },
      ],
    },
    
    // {
    //   section: "Social",
    //   items: [
    //     { name: "Friends", icon: "👥", href: "/friends" },
    //     { name: "Referrals", icon: "🎁", href: "/referrals" },
    //     {
    //       name: "Discord",
    //       icon: "💬",
    //       href: "https://discord.gg/ralli",
    //       external: true,
    //     },
    //   ],
    // },
    // {
    //   section: "Support",
    //   items: [
    //     { name: "Help Center", icon: "❓", href: "/help" },
    //     { name: "Contact Us", icon: "📧", href: "/contact" },
    //     { name: "Settings", icon: "⚙️", href: "/settings" },
    //     {
    //       name: "Logout",
    //       icon: "🚪",
    //       href: "/logout",
    //       className: "text-red-400 hover:text-red-300",
    //     },
    //   ],
    // },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] z-50 transform transition-all duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(15, 23, 42, 0.85) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 flex-shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00CED1] to-[#FFAB91] rounded-xl flex items-center justify-center shadow-lg shadow-[#00CED1]/25">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#00CED1] to-[#FFAB91] bg-clip-text text-transparent">
                Ralli
              </h2>
              <p className="text-slate-300/80 text-xs sm:text-sm">
                Social Parlays
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm hover:scale-105"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Balance Display */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
          <div
            className="rounded-xl p-3 sm:p-4 shadow-lg border border-white/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(0, 206, 209, 0.1) 0%, rgba(255, 171, 145, 0.1) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300/80 text-xs sm:text-sm">Balance</p>
                <p className="text-xl sm:text-2xl font-bold text-[#00CED1] drop-shadow-sm">
                  {isConnected
                  ? balanceLoading
                    ? 'Loading...'
                    : balanceError
                      ? 'Error'
                      : balances.ralli === 0
                        ? 'Top Up'
                        : `$${formatBalance(balances.ralli)}`
                  : '$0.00'}
                </p>
              </div>
              <a
                href="/add-funds"
                className="bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-semibold text-xs sm:text-sm hover:opacity-90 transition-all duration-200 shadow-lg shadow-[#00CED1]/25 hover:shadow-[#00CED1]/40 hover:scale-105 block text-center"
                onClick={onClose}
              >
                Add Funds
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
          <div className="space-y-6 sm:space-y-8">
            {navItems.map((section) => (
              <div key={section.section}>
                <h3 className="text-slate-300/80 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2 sm:mb-3">
                  {section.section}
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className={`flex items-center space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-200 hover:backdrop-blur-sm hover:border hover:border-white/20 group ${
                        item.className || "text-white/90 hover:text-[#00CED1]"
                      } hover:shadow-lg hover:translate-x-1`}
                      style={{
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.backdropFilter = "blur(10px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.backdropFilter = "none";
                      }}
                      onClick={onClose}
                    >
                      <span className="text-base sm:text-lg">{item.icon}</span>
                      <span className="font-medium text-sm sm:text-base">
                        {item.name}
                      </span>
                      {item.external && (
                        <svg
                          className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-75 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-4 sm:p-6 border-t border-white/10 flex-shrink-0"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="text-center">
            <p className="text-slate-300/70 text-xs sm:text-sm">
              Version 1.0.0
            </p>
            <p className="text-slate-400/60 text-xs mt-1">
              © 2025 Ralli. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
