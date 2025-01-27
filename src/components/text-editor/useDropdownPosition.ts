import { useCallback, useState } from "react";
import { getCaretCoordinates } from "../../utils";
import { DropdownPosition } from "../../types/common";

const useDropdownPosition = () => {
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });

  const updateDropdownPosition = useCallback(() => {
    const coordinates = getCaretCoordinates();
    setDropdownPosition(coordinates);
  }, []);

  return {
    dropdownPosition,
    updateDropdownPosition,
  };
};

export default useDropdownPosition;
