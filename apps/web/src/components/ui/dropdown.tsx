"use client";

import { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showIcons?: boolean;
  searchable?: boolean;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  showIcons = true,
  searchable = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all duration-200 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-slate-800/70 cursor-pointer"
        } ${isOpen ? "ring-2 ring-[#00CED1] border-[#00CED1]" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedOption ? (
              <>
                {showIcons && selectedOption.icon && (
                  <span className="text-lg">{selectedOption.icon}</span>
                )}
                <span className="text-white">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
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
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-3 border-b border-slate-700/50">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search options..."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 text-sm focus:ring-2 focus:ring-[#00CED1] focus:border-[#00CED1] transition-all"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  disabled={option.disabled}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-700/50 transition-colors duration-150 ${
                    option.value === value
                      ? "bg-gradient-to-r from-[#00CED1]/10 to-[#FFAB91]/10 border-l-4 border-[#00CED1]"
                      : ""
                  } ${
                    option.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {showIcons && option.icon && (
                      <span className="text-lg">{option.icon}</span>
                    )}
                    <span
                      className={`${
                        option.value === value ? "text-[#00CED1]" : "text-white"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-slate-400 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured sports dropdown
export function SportsDropdown({
  value,
  onChange,
  includeAll = true,
  className = "",
  placeholder = "Select sport",
}: {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const sportsOptions: DropdownOption[] = [
    ...(includeAll ? [{ value: "all", label: "All Sports", icon: "🏆" }] : []),
    { value: "NBA", label: "NBA", icon: "🏀" },
    { value: "NFL", label: "NFL", icon: "🏈" },
    { value: "Soccer", label: "Soccer", icon: "⚽" },
    { value: "Baseball", label: "Baseball", icon: "⚾" },
  ];

  return (
    <Dropdown
      options={sportsOptions}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      showIcons={true}
    />
  );
}
