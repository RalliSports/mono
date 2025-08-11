"use client";

interface MiniProgressBarProps {
  betType: string;
  target: number;
  currentValue: number;
  betDirection: "over" | "under";
  status: "winning" | "losing" | "neutral";
  className?: string;
}

export default function MiniProgressBar({
  betType,
  target,
  currentValue,
  betDirection,
  status,
  className = "",
}: MiniProgressBarProps) {
  // Calculate position based on a range around the target
  const getRange = () => {
    if (
      betType.toLowerCase().includes("point") ||
      betType.toLowerCase().includes("yard")
    ) {
      return target * 0.4; // 40% range for points/yards
    } else if (betType.toLowerCase().includes("total")) {
      return target * 0.3; // 30% range for totals
    } else {
      return target * 0.2; // 20% range for other bets
    }
  };

  const range = getRange();
  const minValue = Math.max(0, target - range);
  const maxValue = target + range;

  const getProgressPosition = () => {
    const clampedValue = Math.max(minValue, Math.min(maxValue, currentValue));
    return ((clampedValue - minValue) / (maxValue - minValue)) * 100;
  };

  const getTargetPosition = () => {
    return ((target - minValue) / (maxValue - minValue)) * 100;
  };

  const getWinningZone = () => {
    const targetPos = getTargetPosition();
    if (betDirection === "over") {
      return { left: targetPos, width: 100 - targetPos };
    } else {
      return { left: 0, width: targetPos };
    }
  };

  const progressPosition = getProgressPosition();
  const targetPosition = getTargetPosition();
  const winningZone = getWinningZone();

  const getStatusColors = () => {
    switch (status) {
      case "winning":
        return {
          bg: "bg-emerald-400",
          trail: "bg-emerald-500",
          glow: "shadow-emerald-400/60 shadow-2xl",
          zone: "bg-emerald-400/30",
          border: "border-emerald-400/50",
        };
      case "losing":
        return {
          bg: "bg-red-400",
          trail: "bg-red-500",
          glow: "shadow-red-400/60 shadow-2xl",
          zone: "bg-red-400/30",
          border: "border-red-400/50",
        };
      default:
        return {
          bg: "bg-amber-400",
          trail: "bg-amber-500",
          glow: "shadow-amber-400/60 shadow-2xl",
          zone: "bg-amber-400/30",
          border: "border-amber-400/50",
        };
    }
  };

  const colors = getStatusColors();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Enhanced Progress Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-slate-300 font-semibold text-sm">
            {betDirection.toUpperCase()} {target}
          </span>
          <div className={`w-2 h-2 rounded-full ${colors.bg} animate-pulse`} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-xs">Current:</span>
          <span
            className={`text-white font-bold text-sm px-2 py-1 rounded-md bg-slate-700/50 ${colors.border} border`}
          >
            {currentValue}
          </span>
        </div>
      </div>

      {/* Enhanced Progress Container - Made Larger and More Visible */}
      <div className="relative h-6 bg-slate-900/90 rounded-xl overflow-hidden border-2 border-slate-600/70 shadow-lg">
        {/* Winning Zone Background - More Prominent */}
        <div
          className={`absolute top-0 h-full ${colors.zone} transition-all duration-500 rounded-xl opacity-40`}
          style={{
            left: `${winningZone.left}%`,
            width: `${winningZone.width}%`,
          }}
        />

        {/* Target Line - More Visible */}
        <div
          className="absolute top-0 w-1.5 h-full bg-white shadow-xl z-20 opacity-90"
          style={{ left: `${targetPosition}%` }}
        />

        {/* Progress Trail - More Visible */}
        <div
          className={`absolute top-0 h-full transition-all duration-700 ${colors.trail} opacity-80 rounded-xl`}
          style={{
            left:
              betDirection === "over"
                ? `${Math.min(targetPosition, progressPosition)}%`
                : "0%",
            width:
              betDirection === "over"
                ? `${Math.abs(progressPosition - targetPosition)}%`
                : `${Math.min(progressPosition, targetPosition)}%`,
          }}
        />

        {/* Current Progress Indicator - Much More Visible */}
        <div
          className={`absolute top-0 w-3 h-full transition-all duration-700 ${colors.bg} shadow-2xl z-30 rounded-xl ${colors.glow}`}
          style={{
            left: `${progressPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Progress indicator dot - Larger and More Prominent */}
          <div
            className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-5 h-5 ${colors.bg} rounded-full border-3 border-white shadow-2xl ${colors.glow} animate-pulse`}
          />
        </div>
      </div>

      {/* Enhanced Range Labels */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
          {minValue.toFixed(1)}
        </span>
        <div className="flex items-center space-x-1">
          <span className="text-slate-400">Need:</span>
          <span
            className={`font-bold ${
              betDirection === "over"
                ? currentValue >= target
                  ? "text-emerald-400"
                  : "text-red-400"
                : currentValue <= target
                  ? "text-emerald-400"
                  : "text-red-400"
            }`}
          >
            {betDirection === "over"
              ? `${Math.max(0, target - currentValue).toFixed(1)} more`
              : `${Math.max(0, currentValue - target).toFixed(1)} less`}
          </span>
        </div>
        <span className="text-slate-500 bg-slate-800/50 px-2 py-1 rounded">
          {maxValue.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
