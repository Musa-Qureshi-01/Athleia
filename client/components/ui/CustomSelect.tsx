"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full font-sans select-none", className)}>
      {/* Hidden input for HTML form validation */}
      {required && (
        <input
          type="text"
          value={value}
          readOnly
          required
          className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
          tabIndex={-1}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-3.5 rounded-lg bg-white border text-left text-[14px] flex items-center justify-between transition-all shadow-2xs cursor-pointer",
          isOpen
            ? "border-[#1F45EC] ring-1 ring-[#1F45EC] shadow-xs"
            : "border-neutral-200/90 hover:border-neutral-300"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "truncate",
            selectedOption ? "text-neutral-900 font-medium" : "text-neutral-400"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={cn(
            "text-neutral-400 transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180 text-[#1F45EC]"
          )}
        />
      </button>

      {/* Floating Options Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-lg border border-neutral-200 shadow-[0_12px_32px_rgba(0,0,0,0.12)] py-1 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "px-3.5 py-2.5 text-[13.5px] flex items-center justify-between cursor-pointer transition-colors",
                  isSelected
                    ? "bg-[#EEF1FF] text-[#1F45EC] font-semibold"
                    : "text-neutral-800 hover:bg-neutral-50 hover:text-black font-medium"
                )}
                role="option"
                aria-selected={isSelected}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={14} className="text-[#1F45EC] shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
