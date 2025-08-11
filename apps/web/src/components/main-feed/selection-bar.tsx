"use client";

interface SelectionBarProps {
  selectedAthletes: string[];
  requiredSelections: number;
  athletes: Array<{
    id: string;
    name: string;
    team: string;
  }>;
  onCancel: () => void;
  onContinue: () => void;
}

export default function SelectionBar({
  selectedAthletes,
  requiredSelections,
  athletes,
  onCancel,
  onContinue,
}: SelectionBarProps) {
  const getAthleteInitials = (athleteId: string) => {
    const athlete = athletes.find((a) => a.id === athleteId);
    return (
      athlete?.name
        .split(" ")
        .map((n) => n[0])
        .join("") || "??"
    );
  };

  const getAthleteTeam = (athleteId: string) => {
    const athlete = athletes.find((a) => a.id === athleteId);
    return athlete?.team || "";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/98 to-slate-800/98 backdrop-blur-md border-t border-slate-700/50 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="flex flex-col space-y-4">
            {/* Progress Info */}
            <div className="text-center">
              <div className="text-white font-bold text-lg mb-1">
                {selectedAthletes.length}/{requiredSelections} Selected
              </div>
              <div className="text-slate-400 text-sm">
                Choose your athletes for this battle
              </div>
            </div>

            {/* Avatar Stack */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: requiredSelections }).map((_, index) => {
                const isSelected = index < selectedAthletes.length;
                const athleteId = selectedAthletes[index];

                return (
                  <div key={index} className="text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg"
                          : "bg-slate-800 border-slate-600 text-slate-400"
                      }`}
                    >
                      {isSelected ? (
                        <span className="text-xs font-bold">
                          {getAthleteInitials(athleteId)}
                        </span>
                      ) : (
                        <span className="text-lg">?</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="text-[#00CED1] text-xs mt-1 font-semibold">
                        {getAthleteTeam(athleteId)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onContinue}
                disabled={selectedAthletes.length !== requiredSelections}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedAthletes.length === requiredSelections
                    ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                }`}
              >
                Continue to Battle
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:justify-between">
          {/* Avatar Stack & Info */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {Array.from({ length: requiredSelections }).map((_, index) => {
                const isSelected = index < selectedAthletes.length;
                const athleteId = selectedAthletes[index];

                return (
                  <div key={index} className="text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-br from-[#00CED1] to-[#FFAB91] border-white text-white shadow-lg"
                          : "bg-slate-800 border-slate-600 text-slate-400"
                      }`}
                    >
                      {isSelected ? (
                        <span className="text-xs font-bold">
                          {getAthleteInitials(athleteId)}
                        </span>
                      ) : (
                        <span className="text-lg">?</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="text-[#00CED1] text-xs mt-1 font-semibold">
                        {getAthleteTeam(athleteId)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="text-white ml-4">
              <div className="text-sm font-semibold">
                {selectedAthletes.length}/{requiredSelections} Selected
              </div>
              <div className="text-xs text-slate-400">
                Choose your athletes for this battle
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onContinue}
              disabled={selectedAthletes.length !== requiredSelections}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 ${
                selectedAthletes.length === requiredSelections
                  ? "bg-gradient-to-r from-[#00CED1] to-[#FFAB91] text-white shadow-lg hover:shadow-xl"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              Continue to Battle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
