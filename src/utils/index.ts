export function getSelectionRange(): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

export function getCaretCoordinates(): { x: number; y: number } {
  const range = getSelectionRange();
  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    return { x, y };
  }
  return { x: 0, y: 0 };
}

