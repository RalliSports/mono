interface TriColorProgressBarProps {
  totalBets: number;
  wonBets: number;
  activeBets: number;
  lostBets: number;
}

export default function TriColorProgressBar({
  totalBets,
  wonBets,
  activeBets,
  lostBets,
}: TriColorProgressBarProps) {
  // Calculate percentages
  const wonPercentage = (wonBets / totalBets) * 100;
  const activePercentage = (activeBets / totalBets) * 100;
  const lostPercentage = (lostBets / totalBets) * 100;
  const pendingBets = totalBets - wonBets - activeBets - lostBets;
  const pendingPercentage = (pendingBets / totalBets) * 100;

  return (
    <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden relative">
      {/* Won section - Green from left */}
      {wonBets > 0 && (
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000"
          style={{ width: `${wonPercentage}%` }}
        />
      )}
      {/* Active section - Blue after won */}
      {activeBets > 0 && (
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-1000"
          style={{
            left: `${wonPercentage}%`,
            width: `${activePercentage}%`,
          }}
        />
      )}
      {/* Lost section - Red after active */}
      {lostBets > 0 && (
        <div
          className="absolute left-0 top-0 bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
          style={{
            left: `${wonPercentage + activePercentage}%`,
            width: `${lostPercentage}%`,
            height: "calc(100% + 1px)",
          }}
        />
      )}
      {/* what the fuck is the problem with red, what ive gathered its an issue with how its rednered and not the code */}
      {/* Pending section - Gray after lost (background already shows this) */}
    </div>
  );
}
