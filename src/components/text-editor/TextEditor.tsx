import React, { useState, useRef } from "react";
import { Editor, EditorState, Modifier, SelectionState } from "draft-js";
import "draft-js/dist/Draft.css";
import "./TextEditor.css";
import SuggestionDropdown from "../SuggestionDropdown/SuggestionDropdown";
import { getCaretCoordinates } from "../../utils";
import { suggestionDecorator } from "../../utils/decorators/autocomplete-suggestion";

const SUGGESTIONS = [
  "test",
  "hello",
  "world",
  "draft-js",
  "hello world",
  "draft-js example",
];

const getMatchString = (
  text: string,
  selectionOffset: number
): string | null => {
  const match = /<>(.*)$/.exec(text.slice(0, selectionOffset));
  return match ? match[1] : null;
};

const TextEditor: React.FC = () => {
  const editorRef = useRef<Editor | null>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(suggestionDecorator)
  );
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const updateSuggestionsState = () => {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      setActiveSuggestion(null);
      return;
    }

    const selectionRange = selection.getRangeAt(0);
    const caretCoordinates = getCaretCoordinates();
    const text =
      selectionRange.startContainer.textContent?.substring(
        0,
        selectionRange.startOffset
      ) || "";

    const currentMatchString = getMatchString(text, selectionRange.startOffset);

    if (currentMatchString !== null) {
      const matchingSuggestions = SUGGESTIONS.filter((s) =>
        s.toLowerCase().startsWith(currentMatchString.toLowerCase())
      );

      setActiveSuggestion(currentMatchString);
      setSuggestions(matchingSuggestions);
      setSelectedIndex(0);
      setDropdownPosition(caretCoordinates);
    } else {
      setActiveSuggestion(null);
      setSuggestions([]);
    }
  };

  const handleEditorChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    updateSuggestionsState();
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
        e.preventDefault();
        if (suggestions.length > 0) {
          handleSuggestionSelected(suggestions[selectedIndex]);
        }
        break;

      case "Escape":
        setActiveSuggestion(null);
        break;

      default:
        break;
    }
  };

  const handleSuggestionSelected = (suggestion: string) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    const anchorKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(anchorKey);
    const text = block.getText();
    const offset = selection.getAnchorOffset();

    // Use regex to locate the match start and end
    const matchStart = text.slice(0, offset).lastIndexOf("<>");
    const matchEnd = offset;

    if (matchStart === -1) {
      console.error("Invalid match for autocomplete");
      return;
    }

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
    setActiveSuggestion(null);
  };

  return (
    <div className="editor-wrapper">
      <div
        className="editor"
        onKeyDown={handleKeyCommand}
        onClick={focusEditor}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Type <> to trigger suggestions"
        />
        {activeSuggestion && suggestions.length > 0 && (
          <SuggestionDropdown
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            position={dropdownPosition}
            onSelect={handleSuggestionSelected}
            onHover={setSelectedIndex}
          />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
