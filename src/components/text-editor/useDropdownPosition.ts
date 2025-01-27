import { useState } from "react";
import { EditorState } from "draft-js";
import { getCaretCoordinates } from "../../utils";

const useDropdownPosition = () => {
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });

  const updateDropdownPosition = () => {
    const coordinates = getCaretCoordinates();
    setDropdownPosition(coordinates);
  };

  return {
    dropdownPosition,
    updateDropdownPosition,
  };
};

export default useDropdownPosition;
