import { useState } from "react";
import { EditorState, Modifier, SelectionState } from "draft-js";
import { getMatchString } from "../../utils";

type UseAutocompleteReturn = {
  activeSuggestion: string | null;
  suggestions: string[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  updateSuggestionsState: (text: string, selectionOffset: number) => void;
  handleSuggestionSelected: (suggestion: string) => void;
  handleEscape: () => void;
};

const useAutocomplete = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
  suggestionsSource: string[]
): UseAutocompleteReturn => {
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const resetAutocompleteState = () => {
    setActiveSuggestion(null);
    setSuggestions([]);
    setSelectedIndex(0);
  };

  const updateSuggestionsState = (text: string, selectionOffset: number) => {
    const currentMatchString = getMatchString(text, selectionOffset);

    if (currentMatchString !== null) {
      const matchingSuggestions = suggestionsSource.filter((s) =>
        s.toLowerCase().startsWith(currentMatchString.toLowerCase())
      );

      if (currentMatchString !== activeSuggestion) {
        setActiveSuggestion(currentMatchString);
      }
      setSuggestions(matchingSuggestions);
      setSelectedIndex(0);
    } else {
      resetAutocompleteState();
    }
  };

  const handleSuggestionSelected = (suggestion: string) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);
    const text = block.getText();
    const offset = selection.getAnchorOffset();

    const matchStart = text.slice(0, offset).lastIndexOf("<>");
    const matchEnd = offset;

    if (matchStart === -1) return;

    const updatedSelection = selection.merge({
      anchorOffset: matchStart,
      focusOffset: matchEnd,
    }) as SelectionState;

    const contentStateWithEntity = contentState.createEntity(
      "SUGGESTION",
      "IMMUTABLE",
      { suggestion }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const newContentState = Modifier.replaceText(
      contentState,
      updatedSelection,
      suggestion,
      undefined,
      entityKey
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    setEditorState(
      EditorState.forceSelection(
        newEditorState,
        newContentState.getSelectionAfter()
      )
    );
    resetAutocompleteState();
  };

  const handleEscape = () => {
    resetAutocompleteState();
  };

  return {
    activeSuggestion,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    updateSuggestionsState,
    handleSuggestionSelected,
    handleEscape, // don't want to export resetAutocompleteState directly
  };
};

export default useAutocomplete;
