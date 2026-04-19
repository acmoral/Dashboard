import { useState,useRef,useEffect } from "react";
import { Input } from "./ui/input";

export function SearchBar({ available, active, onFilterChange, nombreVariable }: { key: string; available: string[]; active: string[]; onFilterChange: (value: string) => void; nombreVariable: string }) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
  if (highlightedIndex >= 0) {
    itemRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }
}, [highlightedIndex]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  }; 
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (!showDropdown || itemsToShow.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    setHighlightedIndex(prev =>
      prev < itemsToShow.length - 1 ? prev + 1 : 0
    );
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    setHighlightedIndex(prev =>
      prev > 0 ? prev - 1 : itemsToShow.length - 1
    );
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (highlightedIndex >= 0) {
      handleItemClick(itemsToShow[highlightedIndex]);
    }
  }

  if (e.key === "Escape") {
    setShowDropdown(false);
  }
};

  const handleItemClick = (item: string) => {
    setInputValue("");
    setShowDropdown(false);
    onFilterChange(item); // Toggle selection
  };

  const handleBlur = () => {
    // Delay to allow click on dropdown items
    setTimeout(() => setShowDropdown(false), 150);
  };

  const itemsToShow = available
  .filter(item =>
    item.toLowerCase().includes(inputValue.toLowerCase())
  )
  .sort((a, b) => {
    const input = inputValue.toLowerCase();
    const aStarts = a.toLowerCase().startsWith(input);
    const bStarts = b.toLowerCase().startsWith(input);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return 0;
  });
  return (
    <div className="relative">
      <Input
        type="text"
        data-slot="input"
        placeholder={`Buscar ${nombreVariable}...`}
        className="pr-10"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
      {showDropdown && inputValue.trim() !== '' && itemsToShow.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 h-64 overflow-y-auto">
          {itemsToShow.map((item, index) => (
            <div
                key={index}
                ref={el => (itemRefs.current[index] = el)}
                className={`px-4 py-2 cursor-pointer
                ${index === highlightedIndex ? "bg-gray-200" : ""}
                ${active.includes(item) ? "text-gray-400 opacity-50" : "text-black"}
                `}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleItemClick(item)}
            >
                {item}
            </div>
            ))}
        </div>
      )}
    </div>
  );
}   