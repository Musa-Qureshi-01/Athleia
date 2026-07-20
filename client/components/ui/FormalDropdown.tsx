"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface FormalDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: "sm" | "md";
}

export function FormalDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
  size = "sm",
}: FormalDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={cn("relative inline-block text-left select-none", className)} ref={dropdownRef}>
      {label && (
        <span className="block text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full flex items-center justify-between gap-2.5 rounded-sm border border-border-subtle bg-bg-primary text-text-primary transition-all duration-150 shadow-xs hover:border-border-strong hover:bg-bg-secondary focus:outline-none focus:border-accent",
          size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
          isOpen && "border-accent bg-bg-secondary ring-1 ring-accent/20"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {SelectedIcon && <SelectedIcon size={14} className="text-accent shrink-0" />}
          <span className="truncate font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-accent/10 text-accent font-semibold">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={cn("text-text-tertiary transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-accent")}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div
          className="absolute right-0 mt-1 min-w-[220px] max-w-[320px] w-max rounded-sm border border-border-strong shadow-xl py-1 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <div className="max-h-60 overflow-y-auto divide-y divide-border-subtle/40">
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs flex items-start justify-between gap-3 transition-colors duration-100",
                    isSelected
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-primary hover:bg-bg-secondary hover:text-text-primary"
                  )}
                >
                  <div className="flex items-start gap-2.5 truncate">
                    {OptionIcon && (
                      <OptionIcon size={14} className={cn("mt-0.5 shrink-0", isSelected ? "text-accent" : "text-text-tertiary")} />
                    )}
                    <div className="flex flex-col gap-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className={cn("truncate", isSelected ? "font-semibold text-accent" : "font-medium")}>
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-bg-secondary border border-border-subtle text-text-secondary font-semibold">
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.description && (
                        <span className="text-[10px] text-text-tertiary leading-tight line-clamp-1">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && <Check size={14} className="text-accent shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
