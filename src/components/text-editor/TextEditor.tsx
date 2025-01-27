import React, { useRef } from "react";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./TextEditor.css";
import SuggestionDropdown from "../SuggestionDropdown/SuggestionDropdown";
import useAutocomplete from "./useAutocomplete";
import useDropdownPosition from "./useDropdownPosition";
import { suggestionDecorator } from "../../utils/decorators/autocomplete-suggestion";

const TextEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null);
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty(suggestionDecorator)
  );

  const {
    activeSuggestion,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    updateSuggestionsState,
    handleSuggestionSelected,
    handleEscape,
    loading,
  } = useAutocomplete(editorState, setEditorState);

  const { dropdownPosition, updateDropdownPosition } = useDropdownPosition();

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectionRange = selection.getRangeAt(0);
    const text =
      selectionRange.startContainer.textContent?.substring(
        0,
        selectionRange.startOffset
      ) || "";

    updateSuggestionsState(text, selectionRange.startOffset);
    updateDropdownPosition();
  };

  const handleKeyCommand = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeSuggestion) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (suggestions.length > 0) {
          setSelectedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (suggestions.length > 0) {
          setSelectedIndex(
            (prevIndex) =>
              (prevIndex - 1 + suggestions.length) % suggestions.length
          );
        }
        break;

      case "Enter":
      case "Tab": // Treat Tab like Enter when suggestions are present
        e.preventDefault();
        if (suggestions.length > 0) {
          handleSuggestionSelected(suggestions[selectedIndex]);
        }
        break;

      case "Escape":
        handleEscape();
        editorRef.current?.focus();
        break;

      default:
        break;
    }
  };

  return (
    <div className="editor-wrapper" onClick={focusEditor}>
      <div className="editor" onKeyDown={handleKeyCommand}>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Type <> to trigger suggestions"
        />
        {(loading || (activeSuggestion && suggestions.length > 0)) && (
          <SuggestionDropdown
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            position={dropdownPosition}
            onSelect={handleSuggestionSelected}
            onHover={setSelectedIndex}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
