"use client";

import { useState } from "react";
import Image from "next/image";
import BoxingLogo from "@/public/images/boxing.svg";
import F1Logo from "@/public/images/F1.svg";
import IPLLogo from "@/public/images/IPL.svg";
import NBALogo from "@/public/images/nba-6.svg";
import OlympicsLogo from "@/public/images/olympics-1.svg";
import WBCLogo from "@/public/images/WBC_logo.svg";

interface Participant {
  name: string;
  record: string;
  bet: string;
  amount: string;
  avatar: string;
  color: string;
  winning?: boolean;
  progress?: number;
}

interface Match {
  name: string;
  bets: number;
}

interface LiveMatch {
  sport: string;
  match: string;
  league: string;
  status: string;
  participants?: Participant[];
  matches?: Match[];
  prize?: string;
  totalPrize?: string;
}

export default function SportsCoverage() {
  const [selectedBets, setSelectedBets] = useState<{ [key: number]: number }>(
    {}
  );
  const [expandedCards, setExpandedCards] = useState<{
    [key: number]: boolean;
  }>({});

  const updateBetAmount = (matchIndex: number, amount: number) => {
    setSelectedBets((prev) => ({
      ...prev,
      [matchIndex]: Math.max(10, Math.min(1000, amount)),
    }));
  };

  const toggleCardExpansion = (matchIndex: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [matchIndex]: !prev[matchIndex],
    }));
  };

  const calculatePayout = (matchIndex: number, odds: number = 1.8) => {
    const betAmount = selectedBets[matchIndex] || 50;
    return Math.round(betAmount * odds);
  };
  const sports = [
    {
      name: "NBA",
      logo: NBALogo,
      description: "Basketball",
      width: 32,
      height: 30,
      color: "orange",
    },
    {
      name: "Formula 1",
      logo: F1Logo,
      description: "Racing",
      width: 44,
      height: 48,
      color: "red",
    },
    {
      name: "IPL",
      logo: IPLLogo,
      description: "Cricket",
      width: 48,
      height: 48,
      color: "blue",
    },
    {
      name: "Boxing",
      logo: BoxingLogo,
      description: "Combat Sports",
      width: 36,
      height: 36,
      color: "red",
    },
    {
      name: "WBC",
      logo: WBCLogo,
      description: "Baseball",
      width: 40,
      height: 48,
      color: "yellow",
    },
    {
      name: "Olympics",
      logo: OlympicsLogo,
      description: "Multi-Sport",
      width: 44,
      height: 44,
      color: "blue",
    },
  ];

  const liveMatches: LiveMatch[] = [
    {
      sport: "NFL",
      match: "Chiefs vs Bills",
      league: "Divisional Championship",
      status: "Live",
      participants: [
        {
          name: "Jake Miller",
          record: "7-2",
          bet: "Chiefs -3.5",
          amount: "$75",
          avatar: "J",
          color: "blue",
        },
        {
          name: "Sarah Chen",
          record: "12-1",
          bet: "Bills +3.5",
          amount: "$75",
          avatar: "S",
          color: "green",
        },
      ],
      prize: "$150",
    },
    {
      sport: "NBA",
      match: "Lakers vs Warriors",
      league: "Western Conference Finals",
      status: "Q3",
      participants: [
        {
          name: "Mike Rodriguez",
          record: "9-3",
          bet: "Over 225.5",
          amount: "$100",
          avatar: "M",
          color: "purple",
          winning: true,
          progress: 80,
        },
      ],
      prize: "$200",
    },
    {
      sport: "Premier League",
      match: "Multiple Matches",
      league: "8 Active Matches",
      status: "Live",
      matches: [
        { name: "Arsenal vs Chelsea", bets: 4 },
        { name: "Man City vs Liverpool", bets: 3 },
        { name: "Tottenham vs Newcastle", bets: 2 },
      ],
      totalPrize: "$1,247",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-bl from-white to-[#F5F5DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-6 py-3 mb-8">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Comprehensive Sports Coverage
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Every Sport.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Every League.
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From major professional leagues to international competitions,
            challenge friends across all the sports that matter most.
          </p>
        </div>

        {/* Sports Grid */}
        <div className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sports.map((sport, index) => (
              <div
                key={sport.name}
                className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-slate-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <Image
                      src={sport.logo}
                      width={sport.width}
                      height={sport.height}
                      alt={sport.name}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {sport.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {sport.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Betting Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3 mb-8">
              <div className="relative">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">
                Live Betting Activity
              </span>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Join Active{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Challenges
              </span>
            </h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              See what your friends are betting on right now and join the action
              with your own predictions.
            </p>
          </div>{" "}
          {/* Interactive Live Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveMatches.map((match, index) => {
              const betAmount = selectedBets[index] || 50;
              const isExpanded = expandedCards[index];
              const potentialPayout = calculatePayout(index);

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 ${
                    isExpanded ? "p-8" : "p-6"
                  }`}
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-1">
                        {match.match}
                      </h4>
                      <p className="text-sm text-slate-500">{match.league}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          match.status === "Live"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {match.status}
                      </div>
                      <button
                        onClick={() => toggleCardExpansion(index)}
                        className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 text-slate-600 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Bet Amount Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-5 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-700">
                        Your Bet Amount
                      </span>
                      <span className="text-xs text-slate-500">
                        Min: $10 | Max: $1,000
                      </span>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <button
                        onClick={() => updateBetAmount(index, betAmount - 10)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        disabled={betAmount <= 10}
                      >
                        <svg
                          className="w-5 h-5 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>

                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={betAmount}
                          onChange={(e) =>
                            updateBetAmount(
                              index,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full bg-white rounded-xl pl-8 pr-4 py-3 text-center font-semibold text-slate-900 border border-slate-200 focus:border-blue-400 focus:outline-none"
                          min="10"
                          max="1000"
                        />
                      </div>

                      <button
                        onClick={() => updateBetAmount(index, betAmount + 10)}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        disabled={betAmount >= 1000}
                      >
                        <svg
                          className="w-5 h-5 text-slate-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Quick Bet Buttons */}
                    <div className="flex space-x-2 mb-4">
                      {[25, 50, 100, 250].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => updateBetAmount(index, amount)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            betAmount === amount
                              ? "bg-blue-600 text-white"
                              : "bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>

                    {/* Potential Payout */}
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Potential Payout
                        </span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-emerald-600">
                            ${potentialPayout}
                          </div>
                          <div className="text-xs text-slate-500">
                            +${potentialPayout - betAmount} profit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  {match.participants && (
                    <div className="space-y-4 mb-6">
                      {match.participants.map((participant, pIndex) => (
                        <div
                          key={pIndex}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            participant.winning
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-slate-50 border-slate-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                                  participant.color === "blue"
                                    ? "bg-blue-500"
                                    : participant.color === "green"
                                      ? "bg-emerald-500"
                                      : participant.color === "purple"
                                        ? "bg-violet-500"
                                        : "bg-slate-500"
                                }`}
                              >
                                {participant.avatar}
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">
                                  {participant.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {participant.record} record
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-slate-900">
                                {participant.bet}
                              </div>
                              <div className="text-sm text-slate-500">
                                {participant.amount}
                              </div>
                            </div>
                          </div>
                          {participant.winning && participant.progress && (
                            <div className="mt-3">
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${participant.progress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                Currently winning • Need{" "}
                                {100 - participant.progress}% more
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multiple Matches */}
                  {match.matches && isExpanded && (
                    <div className="space-y-3 mb-6">
                      <h5 className="font-medium text-slate-900 mb-3">
                        Active Matches
                      </h5>
                      {match.matches.map((subMatch, mIndex) => (
                        <div
                          key={mIndex}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700">
                            {subMatch.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-blue-600">
                              {subMatch.bets} bets
                            </span>
                            <button className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
                              Join
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-3">
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                      onClick={() => {
                        // Simulate bet placement
                        alert(
                          `Bet placed: $${betAmount} with potential payout of $${potentialPayout}!`
                        );
                      }}
                    >
                      Place Bet - ${betAmount}
                    </button>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => toggleCardExpansion(index)}
                        className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors"
                      >
                        {isExpanded ? "Less Info" : "More Info"}
                      </button>
                      <button className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-200 transition-colors">
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Real-time Updates */}
                  {isExpanded && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">
                          Live Updates
                        </span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Total Bets Placed:</span>
                          <span className="font-medium">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Bet:</span>
                          <span className="font-medium">$73</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Most Popular Bet:</span>
                          <span className="font-medium">
                            {match.participants?.[0]?.bet || "Over"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-6">
            <span className="text-sm font-semibold text-blue-700">
              Ready to start betting?
            </span>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            Create Your First Challenge
          </button>
        </div>
      </div>
    </section>
  );
}
