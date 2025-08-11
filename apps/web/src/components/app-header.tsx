"use client";

import Link from "next/link";
import Logo from "./ui/logo";
import { useState, useEffect } from "react";
import { ParaButton } from "./para-modal";

export function AppHeader() {
  return (
    <>
      {/* Floating Header Container */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <header className="relative bg-white/90 backdrop-blur-xl border border-gray-200/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Logo />
              </div>{" "}
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link
                  href="/nfl"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  NFL
                </Link>

                <Link
                  href="/nba"
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  NBA
                </Link>

                <Link
                  href="/soccer"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200"
                >
                  Soccer
                </Link>

                <Link
                  href="/baseball"
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
                >
                  Baseball
                </Link>

                <div className="h-6 w-px bg-gray-300"></div>

                <Link
                  href="/compy"
                  className="group relative overflow-hidden px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-md hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center space-x-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <span>Components</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>

                <div className="h-6 w-px bg-gray-300"></div>

                <Link
                  href="/leaderboard"
                  className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                >
                  Leaderboard
                </Link>
              </nav>{" "}
              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-4">
                <ParaButton></ParaButton>

                <Link
                  href="/signup"
                  className="group relative overflow-hidden px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <span>Get Started</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Link>
              </div>
              {/* Mobile menu button */}
              <button className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors duration-200">
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>{" "}
        </header>
      </div>
    </>
  );
}
