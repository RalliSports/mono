'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface MultiSelectFilterProps {
  label: string
  options: FilterOption[]
  selectedValues: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelectFilter({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options...',
  className = '',
}: MultiSelectFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  const handleRemoveOption = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value))
  }

  const clearAll = () => {
    onChange([])
  }

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder
    if (selectedValues.length === 1) {
      const option = options.find((opt) => opt.value === selectedValues[0])
      return option?.label || selectedValues[0]
    }
    return `${selectedValues.length} selected`
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="mb-1">
        <label className="text-sm font-medium text-slate-300">{label}</label>
      </div>

      {/* Selected values display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedValues.map((value) => {
            const option = options.find((opt) => opt.value === value)
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#00CED1]/20 text-[#00CED1] text-xs rounded-md"
              >
                {option?.label || value}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveOption(value)
                  }}
                  className="hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          })}
          {selectedValues.length > 1 && (
            <button onClick={clearAll} className="text-xs text-slate-400 hover:text-white px-2 py-1">
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-lg text-left hover:border-slate-600 focus:outline-none focus:border-[#00CED1]"
      >
        <span className={selectedValues.length === 0 ? 'text-slate-400' : 'text-white'}>{getDisplayText()}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToggleOption(option.value)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={() => {}} // Controlled by button click
                  className="mr-3 h-4 w-4 text-[#00CED1] bg-slate-700 border-slate-600 rounded focus:ring-[#00CED1] focus:ring-2"
                />
                <span className="text-white">{option.label}</span>
              </div>
              {option.count !== undefined && <span className="text-slate-400 text-sm">{option.count}</span>}
            </button>
          ))}
          {options.length === 0 && <div className="p-3 text-slate-400 text-center">No options available</div>}
        </div>
      )}
    </div>
  )
}
