import React from "react";
import "./SuggestionDropdown.css";
import { DropdownPosition } from "../../types/common";

interface SuggestionDropdownProps {
  suggestions: string[];
  selectedIndex: number;
  position: DropdownPosition;
  onSelect: (suggestion: string) => void;
  onHover: (index: number) => void;
  loading: boolean;
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  suggestions,
  selectedIndex,
  position,
  onSelect,
  onHover,
  loading,
}) => {
  if (!loading && suggestions.length === 0) return null;

  const adjustedPosition = {
    x: position.x + window.scrollX,
    y: position.y + window.scrollY,
  }

  return (
    <div
      className="suggestions-dropdown"
      style={{ top: adjustedPosition.y, left: adjustedPosition.x }}
    >
      <ul className="suggestions-list">
        {loading && <li className="loading">Loading...</li>}
        {!loading &&
          suggestions.map((suggestion, index) => (
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
