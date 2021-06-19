import "emoji-mart/css/emoji-mart.css";

import { emojiIndex, BaseEmoji, EmojiData } from "emoji-mart";

import {
  useState,
  useCallback,
  MouseEvent,
  ChangeEvent,
  RefObject,
  forwardRef,
  MutableRefObject,
} from "react";

import EmojiPicker from "./EmojiPicker";
import SuggestArea from "./SuggestArea";

interface EmojiTextAreaProps {
  ref?: RefObject<HTMLTextAreaElement>;
  showPicker?: boolean;
  onSuggesting?: (val: boolean) => void;
  onClick?: (e: MouseEvent<HTMLTextAreaElement>) => void;
  onChange: (val: string) => void;
  rows?: number;
  cols?: number;
}

const EmojiTextArea: React.ForwardRefRenderFunction<
  HTMLTextAreaElement,
  EmojiTextAreaProps
> = (props, ref) => {
  const rowMax = 3;
  const columnMax = 9;

  const textAreaElement = () =>
    (ref as MutableRefObject<HTMLTextAreaElement>).current;

  const [state, setState] = useState({
    text: "",
    editingEmoji: "",
    selectedEmojiIndex: 0,
    suggestions: Array<EmojiData>(),
    isShowPicker: false,
  });

  const { suggestions, selectedEmojiIndex, text, editingEmoji } = state;

  const setTextAreaCursor = (cursor: number) => {
    const element = textAreaElement();
    if (element) {
      setTimeout(() => {
        element.focus();
        element.selectionStart = cursor;
        element.selectionEnd = cursor;
      }, 0);
    }
  };

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      event.persist();
      let currentText = event.target.value;

      let emojiSentenceIndex = -1;
      let selectionStart = event.target.selectionStart - 1;
      if (currentText[selectionStart] === ":") {
        selectionStart -= 1;
      }

      for (let i = selectionStart; i >= 0; i--) {
        if (currentText[i] === ":") {
          emojiSentenceIndex = i;
          break;
        } else if (/\s+/.test(currentText[i])) {
          break;
        }
      }

      const matches = /^:[a-z0-9!@#$%^&*)(+=._-]+:?/.exec(
        currentText.substr(emojiSentenceIndex)
      );
      const currentEmoji =
        emojiSentenceIndex > -1 && matches ? matches[0] : null;

      let suggestions: Array<EmojiData> | null = null;
      if (currentEmoji) {
        let emoji = currentEmoji.substr(1);
        if (emoji.slice(-1) === ":") {
          emoji = emoji.slice(0, -1);
          const currentSuggestions = emojiIndex.search(emoji);
          if (currentSuggestions != null && currentSuggestions.length > 0) {
            const emojiReplace = (currentSuggestions[0] as BaseEmoji).native;
            currentText = currentText.replace(currentEmoji, emojiReplace);

            setTextAreaCursor(emojiSentenceIndex + emojiReplace.length);
          }
        } else {
          suggestions = emojiIndex.search(emoji);
          if (suggestions) {
            suggestions = suggestions.slice(0, rowMax * columnMax);
          }
        }
      }

      props.onChange(currentText);
      if (props.onSuggesting) {
        const isExistSuggestions = suggestions && suggestions.length > 0;
        props.onSuggesting(isExistSuggestions ? isExistSuggestions : false);
      }

      setState({
        ...state,
        text: currentText,
        editingEmoji: currentEmoji ? currentEmoji : "",
        suggestions: suggestions ? suggestions : [],
        selectedEmojiIndex: 0,
      });
    },
    [state]
  );

  const forwardEmoji = (isVertical: boolean) => {
    const move = isVertical ? columnMax : 1;
    const index = selectedEmojiIndex + move;
    setState({
      ...state,
      selectedEmojiIndex:
        index >= suggestions.length ? suggestions.length - 1 : index,
    });
  };

  const beforeEmoji = (isVertical: boolean) => {
    const move = isVertical ? columnMax : 1;
    const index = selectedEmojiIndex - move;
    setState({
      ...state,
      selectedEmojiIndex: index < 0 ? 0 : index,
    });
  };

  const enterEmoji = (emojiData: EmojiData) => {
    const emoji = (emojiData as BaseEmoji).native;
    const cursor = text.indexOf(editingEmoji) + emoji.length + 1;

    setState({
      ...state,
      text: text.replace(editingEmoji, `${emoji} `),
      editingEmoji: "",
      suggestions: [],
    });

    if (props.onSuggesting) {
      props.onSuggesting(false);
    }
    setTextAreaCursor(cursor);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!e.ctrlKey && !e.shiftKey) {
      switch (e.key) {
        case "Left":
        case "ArrowLeft":
          if (suggestions.length > 0) {
            beforeEmoji(false);
            e.preventDefault();
          }
          break;
        case "Right":
        case "ArrowRight":
          if (suggestions.length > 0) {
            forwardEmoji(false);
            e.preventDefault();
          }
          break;
        case "Up":
        case "ArrowUp":
          if (suggestions.length > 0) {
            beforeEmoji(true);
            e.preventDefault();
          }
          break;
        case "Down":
        case "ArrowDown":
          if (suggestions.length > 0) {
            forwardEmoji(true);
            e.preventDefault();
            break;
          }
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        if (suggestions.length > 0) {
          enterEmoji(suggestions[selectedEmojiIndex]);
          e.preventDefault();
        }
        break;
      case "Tab":
      case " ":
        setState({
          ...state,
          editingEmoji: "",
          suggestions: [],
        });
        break;
    }
  };

  const onSelectEmoji = (emoji: EmojiData) => {
    const element = textAreaElement();
    const before = text.slice(0, element.selectionStart);
    const native = (emoji as BaseEmoji).native;
    const after = text.slice(element.selectionStart);

    const newText = `${before}${native}${after}`;

    setState({
      ...state,
      text: newText,
      editingEmoji: "",
      suggestions: [],
      selectedEmojiIndex: 0,
    });

    setTextAreaCursor(before.length + native.length);
  };

  const highlight = editingEmoji.substr(1);
  return (
    <div>
      <textarea
        autoFocus={true}
        value={text}
        onChange={handleChange}
        onClick={(e) => {
          if (props.onClick) props.onClick(e);
        }}
        ref={ref}
        rows={props.rows ? props.rows : 3}
        cols={props.cols ? props.cols : 40}
        placeholder={
          ": (colon) followed by the first few letters of the emoji !\n :+1:, :cat:, :hand: and so on. 😉👉"
        }
        onKeyDown={handleKeyDown}
        onKeyPress={handleKeyUp}
      />
      <SuggestArea
        emojiIndex={selectedEmojiIndex}
        suggestions={suggestions}
        highlight={highlight}
        onOverEmojiIndex={(index) =>
          setState({ ...state, selectedEmojiIndex: index })
        }
        onSelect={enterEmoji}
      />
      <EmojiPicker hidden={!props.showPicker} onSelect={onSelectEmoji} />
    </div>
  );
};

export default forwardRef(EmojiTextArea);
