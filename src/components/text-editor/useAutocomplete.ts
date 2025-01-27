import { useState } from "react";
import { EditorState, Modifier, SelectionState } from "draft-js";
import { getMatchString } from "../../utils";
import { fetchSuggestions } from "../../api/suggestionsApi";

type UseAutocompleteReturn = {
  activeSuggestion: string | null;
  suggestions: string[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  updateSuggestionsState: (editorState: EditorState) => void;
  handleSuggestionSelected: (suggestion: string) => void;
  handleEscape: () => void;
  loading: boolean;
};

const useAutocomplete = (
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
): UseAutocompleteReturn => {
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const resetAutocompleteState = () => {
    setActiveSuggestion(null);
    setSuggestions([]);
    setSelectedIndex(0);
    setLoading(false);
  };

  const updateSuggestionsState = async (editorState: EditorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (!selection.isCollapsed()) {
      resetAutocompleteState();
      return;
    }

    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);
    const text = block.getText();
    const offset = selection.getAnchorOffset();
    const textBeforeCaret = text.slice(0, offset);

    const currentMatchString = getMatchString(textBeforeCaret, offset);

    if (currentMatchString === activeSuggestion) {
      return;
    }

    // Ensure the match string is valid and has at least one character
    if (currentMatchString === null || currentMatchString.trim().length === 0) {
      resetAutocompleteState();
      return;
    }

    setLoading(true); // Start loading
    try {
      // Fetch suggestions dynamically based on the match string
      const fetchedSuggestions = await fetchSuggestions(currentMatchString);

      // Update autocomplete state
      setActiveSuggestion(currentMatchString);
      setSuggestions(fetchedSuggestions);
      
      setSelectedIndex(0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      resetAutocompleteState();
    } finally {
      setLoading(false); // Stop loading
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
    handleEscape,
    loading,
  };
};

export default useAutocomplete;
