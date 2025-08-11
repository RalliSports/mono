interface BettingTagProps {
  text: string;
  className?: string;
}

export default function BettingTag({ text, className = "" }: BettingTagProps) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Tag with slim border */}
        <div className="bg-gray-900/90 rounded-full px-4 py-2 backdrop-blur-sm border border-[#00CED1]/50">
          <span className="text-white font-semibold text-sm whitespace-nowrap">
            {text}
          </span>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-[#00CED1]/20 rounded-full blur-sm -z-10"></div>
      </div>
    </div>
  );
}
