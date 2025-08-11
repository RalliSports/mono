"use client";

import { useState } from "react";
import Image from "next/image";
import BoxingLogo from "@/public/images/boxing.svg";
import F1Logo from "@/public/images/F1.svg";
import IPLLogo from "@/public/images/IPL.svg";
import NBALogo from "@/public/images/nba-6.svg";
import OlympicsLogo from "@/public/images/olympics-1.svg";
import WBCLogo from "@/public/images/WBC_logo.svg";

interface LiveMatch {
  sport: string;
  match: string;
  league: string;
  status: string;
  bet1: { name: string; option: string; amount: string };
  bet2: { name: string; option: string; amount: string };
  prize: string;
}

export default function SportsCoverage() {
  const [selectedAmounts, setSelectedAmounts] = useState<{
    [key: number]: number;
  }>({});

  const updateBetAmount = (matchIndex: number, amount: number) => {
    setSelectedAmounts((prev) => ({
      ...prev,
      [matchIndex]: amount,
    }));
  };

  const sports = [
    {
      name: "NBA",
      logo: NBALogo,
      description: "Basketball",
      width: 32,
      height: 30,
    },
    {
      name: "Formula 1",
      logo: F1Logo,
      description: "Racing",
      width: 44,
      height: 48,
    },
    {
      name: "IPL",
      logo: IPLLogo,
      description: "Cricket",
      width: 48,
      height: 48,
    },
    {
      name: "Boxing",
      logo: BoxingLogo,
      description: "Combat Sports",
      width: 36,
      height: 36,
    },
    {
      name: "WBC",
      logo: WBCLogo,
      description: "Baseball",
      width: 40,
      height: 48,
    },
    {
      name: "Olympics",
      logo: OlympicsLogo,
      description: "Multi-Sport",
      width: 44,
      height: 44,
    },
  ];

  const liveMatches: LiveMatch[] = [
    {
      sport: "NFL",
      match: "Chiefs vs Bills",
      league: "Divisional Championship",
      status: "Live",
      bet1: { name: "Jake M.", option: "Chiefs -3.5", amount: "$75" },
      bet2: { name: "Sarah C.", option: "Bills +3.5", amount: "$75" },
      prize: "$150",
    },
    {
      sport: "NBA",
      match: "Lakers vs Warriors",
      league: "Western Conference",
      status: "Q3",
      bet1: { name: "Mike R.", option: "Over 225.5", amount: "$100" },
      bet2: { name: "Open", option: "Under 225.5", amount: "-" },
      prize: "$200",
    },
    {
      sport: "Soccer",
      match: "Arsenal vs Chelsea",
      league: "Premier League",
      status: "Live",
      bet1: { name: "Alex K.", option: "Arsenal Win", amount: "$60" },
      bet2: { name: "Open", option: "Chelsea Win", amount: "-" },
      prize: "$120",
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
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
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
              See what your friends are betting on and join the action with your
              own predictions.
            </p>
          </div>

          {/* Simplified Live Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveMatches.map((match, index) => {
              const betAmount = selectedAmounts[index] || 50;
              const potentialPayout = Math.round(betAmount * 1.9);

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-1">
                        {match.match}
                      </h4>
                      <p className="text-sm text-slate-500">{match.league}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.status === "Live"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {match.status}
                    </div>
                  </div>

                  {/* Current Bets */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {match.bet1.name.split(" ")[0][0]}
                        </div>
                        <span className="font-medium text-slate-900">
                          {match.bet1.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">
                          {match.bet1.option}
                        </div>
                        <div className="text-sm text-slate-500">
                          {match.bet1.amount}
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-2">
                      <span className="text-xs text-slate-400 font-medium">
                        VS
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {match.bet2.name === "Open"
                            ? "?"
                            : match.bet2.name.split(" ")[0][0]}
                        </div>
                        <span className="font-medium text-slate-600">
                          {match.bet2.name === "Open"
                            ? "Open Spot"
                            : match.bet2.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-600">
                          {match.bet2.option}
                        </div>
                        <div className="text-sm text-slate-400">
                          {match.bet2.amount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Bet Section */}
                  <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-700">
                        Your Bet
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        ${potentialPayout} payout
                      </span>
                    </div>

                    <div className="flex space-x-2 mb-3">
                      {[25, 50, 100, 200].map((amount) => (
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

                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={betAmount}
                      onChange={(e) =>
                        updateBetAmount(index, parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>$10</span>
                      <span className="font-medium">${betAmount}</span>
                      <span>$500</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() =>
                      alert(
                        `Bet placed: $${betAmount} → Potential payout: $${potentialPayout}`
                      )
                    }
                  >
                    Counter Bet ${betAmount}
                  </button>
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

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </section>
  );
}
