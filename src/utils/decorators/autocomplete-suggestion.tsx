import React from "react";
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  CharacterMetadata,
} from "draft-js";

export const Suggestion: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <span className="suggestion-entity">{children}</span>;

export const findSuggestionEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character: CharacterMetadata) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "SUGGESTION"
    );
  }, callback);
};

export const suggestionDecorator = new CompositeDecorator([
  {
    strategy: findSuggestionEntities,
    component: Suggestion,
  },
]);
