import React from "react";
import "./SuggestionDropdown.css";

interface SuggestionDropdownProps {
  suggestions: string[];
  selectedIndex: number;
  position: { x: number; y: number };
  onSelect: (suggestion: string) => void;
  onHover: (index: number) => void;
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  suggestions,
  selectedIndex,
  position,
  onSelect,
  onHover,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="suggestions-dropdown"
      style={{ top: position.y, left: position.x }}
    >
      <ul className="suggestions-list">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion}
            className={
              index === selectedIndex
                ? "highlighted suggestion-item"
                : "suggestion-item"
            }
            onMouseDown={() => onSelect(suggestion)}
            onMouseEnter={() => onHover(index)}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionDropdown;