import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface SearchableSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`flex items-center justify-between cursor-pointer select-none ${className} ${!value ? 'text-gray-500' : 'text-gray-900'}`}
        onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setSearchTerm("");
        }}
        tabIndex={0}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-60">
          <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50 sticky top-0">
            <Search className="w-4 h-4 text-gray-400 ml-1 shrink-0" />
            <input 
              ref={searchInputRef}
              type="text" 
              className="w-full bg-transparent outline-none text-sm placeholder-gray-400"
              placeholder="Search language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">No results found</div>
            ) : (
                filteredOptions.map((opt) => (
                <div 
                    key={opt}
                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-green-50 hover:text-green-700 transition-colors ${value === opt ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-700'}`}
                    onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                        setSearchTerm("");
                    }}
                >
                    {opt}
                </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
