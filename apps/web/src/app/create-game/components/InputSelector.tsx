import { InputSelectorProps } from './types'

const colorSchemes = {
  cyan: {
    hover: 'hover:border-[#00CED1]/50',
    iconBg: 'from-[#00CED1]/20 to-blue-500/10',
    iconBorder: 'border-[#00CED1]/20',
    focus: 'focus:border-[#00CED1]/70 focus:ring-[#00CED1]/20',
    valueColor: 'text-[#00CED1]',
  },
  orange: {
    hover: 'hover:border-orange-400/50',
    iconBg: 'from-orange-500/20 to-orange-400/10',
    iconBorder: 'border-orange-400/20',
    focus: 'focus:border-orange-400/70 focus:ring-orange-400/20',
    valueColor: 'text-orange-400',
  },
  teal: {
    hover: 'hover:border-teal-400/50',
    iconBg: 'from-teal-500/20 to-teal-400/10',
    iconBorder: 'border-teal-400/20',
    focus: 'focus:border-teal-400/70 focus:ring-teal-400/20',
    valueColor: 'text-teal-400',
  },
}

export default function InputSelector({
  value,
  onChange,
  min,
  max,
  step,
  label,
  description,
  placeholder,
  icon,
  colorScheme,
}: InputSelectorProps) {
  const colors = colorSchemes[colorScheme]

  const handleInputChange = (inputValue: string) => {
    const numValue = inputValue === '' ? '' : parseInt(inputValue)
    onChange(numValue as number)
  }

  const handleInputBlur = (inputValue: string) => {
    const numValue = Math.max(min, Math.min(max, parseInt(inputValue) || min))
    onChange(numValue)
  }

  return (
    <div
      className={`bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 ${colors.hover} transition-all duration-300`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${colors.iconBg} rounded-lg flex items-center justify-center border ${colors.iconBorder}`}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div>
          <h3 className="text-white font-bold">{label}</h3>
          <p className="text-slate-400 text-xs">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Direct Input Field */}
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={(e) => handleInputBlur(e.target.value)}
            min={min}
            max={max}
            step={step}
            className={`flex-1 bg-gradient-to-br from-slate-700/80 to-slate-800/60 border-2 border-slate-600/40 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none ${colors.focus} focus:ring-2 transition-all duration-300 text-center font-bold`}
            placeholder={placeholder}
          />
        </div>

        {/* Slider */}
        <div className="flex items-center space-x-3">
          <input
            type="range"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className={`${colors.valueColor} font-bold text-xl min-w-[3rem] text-center`}>
            {colorScheme === 'cyan' ? `$${value}` : value}
          </span>
        </div>

        <div className="flex justify-between text-xs text-slate-500">
          <span>{colorScheme === 'cyan' ? `$${min}` : min}</span>
          <span>{colorScheme === 'cyan' ? `$${max}` : max}</span>
        </div>
      </div>
    </div>
  )
}
