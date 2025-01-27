import { CaretCoordinates } from "../types/common";

export function getSelectionRange(): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

export function getCaretCoordinates(): CaretCoordinates {
  const range = getSelectionRange();
  if (range) {
    const { left: x, top: y } = range.getBoundingClientRect();
    return { x, y };
  }
  return { x: 0, y: 0 };
}

export function getMatchString(
  text: string,
  selectionOffset: number
): string | null {
  const match = /<>(.*)$/.exec(text.slice(0, selectionOffset));
  return match ? match[1] : null;
}
