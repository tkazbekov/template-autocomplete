import { useState } from "react";
import { getCaretCoordinates } from "../../utils";
import { DropdownPosition } from "../../types/common";

const useDropdownPosition = () => {
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });

  const updateDropdownPosition = () => {
    const coordinates = getCaretCoordinates();
    if (
      coordinates.x !== dropdownPosition.x ||
      coordinates.y !== dropdownPosition.y
    ) {
      setDropdownPosition(coordinates);
    }
  };

  return {
    dropdownPosition,
    updateDropdownPosition,
  };
};

export default useDropdownPosition;
