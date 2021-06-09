import "emoji-mart/css/emoji-mart.css";

import { Picker, BaseEmoji, EmojiData, emojiIndex } from "emoji-mart";

import classNames from "classnames";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useHotkeys} from "react-hotkeys-hook"

import { ChangeEvent, useEffect, useState, useRef } from "react";

import "./App.css";

function App() {
  const rowMax = 3;
  const columnMax = 9;

  const textAreaEl = useRef(null);
  const [state, setState] = useState({
    text: "",
    editingEmoji: "",
    selectedEmojiIndex: 0,
    suggestions: Array<EmojiData>(),
    copyButtonText: "📋 (Ctrl + C)",
    isShowPicker: false,
  });

  useHotkeys('ctrl+w,cmd+shift+o,ctrl+shift+o', () => window.close());
  useHotkeys('ctrl+c,cmd+c', () => copyTextAreaText());

  const copyTextAreaText = () => {
    const element = textAreaElement();
    const currentCursor = element.selectionStart;

    element.select();
    document.execCommand("copy");

    setTextAreaCursor(currentCursor);

    setState({
      ...state,
      copyButtonText: "📋✔️ (Ctrl + C)",
    });
  }

  const switchShowPicker = () => {
    const isShowPicker = !state.isShowPicker;
    setState({
      ...state,
      editingEmoji: "",
      suggestions: [],
      isShowPicker,
    });

    if (!isShowPicker) {
      const element = textAreaElement();
      setTextAreaCursor(element.selectionStart);
    }
  };

  const textAreaElement = () =>
    textAreaEl.current as unknown as HTMLTextAreaElement;

  useEffect(() => {
    const switchShowPickerShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        switchShowPicker();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        copyTextAreaText();
      }
    };
    document.addEventListener("keydown", switchShowPickerShortcut);

    return function cleanup() {
      document.removeEventListener("keydown", switchShowPickerShortcut);
    };
  });

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.persist();
    let currentText = event.target.value;

    let emojiSentenceIndex = -1;
    for (let i = event.target.selectionStart - 1; i >= 0; i--) {
      const colonBeforeEmpty = /\s+/.test(currentText[i - 1]) || i - 1 <= 0;
      if (colonBeforeEmpty && currentText[i] === ":") {
        emojiSentenceIndex = i;
        break;
      } else if (/\s+/.test(currentText[i])) {
        break;
      }
    }

    const currentEmoji =
      emojiSentenceIndex > -1
        ? currentText.substr(emojiSentenceIndex).split(/\s+/)[0]
        : null;

    let suggestions: Array<EmojiData> | null = null;
    if (currentEmoji) {
      let emoji = currentEmoji.substr(1);
      if (emoji.slice(-1) === ":") {
        emoji = emoji.slice(0, -1);
        const currentSuggestions = emojiIndex.search(emoji);
        if (currentSuggestions != null && currentSuggestions.length > 0) {
          const emojiReplace = (currentSuggestions[0] as BaseEmoji).native;
          currentText = currentText.replace(currentEmoji, `${emojiReplace} `);
        }
      } else {
        suggestions = emojiIndex.search(emoji);
        if (suggestions) {
          suggestions = suggestions.slice(0, rowMax * columnMax);
        }
      }
    }

    setState({
      ...state,
      text: currentText,
      editingEmoji: currentEmoji ? currentEmoji : "",
      suggestions: suggestions ? suggestions : [],
      isShowPicker: false,
      copyButtonText: "📋 (Ctrl + C)",
      selectedEmojiIndex: 0,
    });
  };

  // ref: https://www.nxworld.net/js-array-chunk.html
  const arrayChunk = ([...array]: EmojiData[], size = 1): EmojiData[][] => {
    return array.reduce(
      (acc, _, index) =>
        index % size ? acc : [...acc, array.slice(index, index + size)],
      [] as EmojiData[][]
    );
  };

  const setTextAreaCursor = (cursor: number) => {
    setTimeout(() => {
      const element = textAreaElement();
      if (element) {
        element.focus();
        element.selectionStart = cursor;
        element.selectionEnd = cursor;
      }
    }, 1);
  };

  const selectedEmojiInfo = (highlight: string) => {
    const emoji = suggestions[selectedEmojiIndex] as BaseEmoji | null;
    const { short_names } = suggestions[selectedEmojiIndex] as {
      short_names: string[];
    };
    if (emoji) {
      return (
        <div className={classNames("emoji", "info")}>
          <span>{emoji.native}</span>
          <br />
          <p className={"colons"}>
            {short_names.map((s) => {
              const start = s.indexOf(highlight);
              const before = s.slice(0, start);
              const highlightEmoji = s.slice(start, start + highlight.length);
              const after = s.slice(start + highlight.length);

              return (
                <span key={s}>
                  :{before}
                  <span style={{ color: "blue", backgroundColor: "yellow" }}>
                    {highlightEmoji}
                  </span>
                  {after}:
                </span>
              );
            })}
          </p>
        </div>
      );
    }
    return null;
  };

  let suggestsElement = null;
  const {
    suggestions,
    selectedEmojiIndex,
    text,
    editingEmoji,
    isShowPicker,
    copyButtonText,
  } = state;

  if(process.env.NODE_ENV === 'production') {
    chrome.runtime.sendMessage(
      {
        action: "resizeWindow",
        data: { isShowPicker, isSuggesting: suggestions.length > 0 }
      }
    );
  }

  if (suggestions.length > 0) {
    const suggestionsChunk = arrayChunk(suggestions, columnMax);
    const highlight = editingEmoji.substr(1);
    suggestsElement = (
      <div>
        {selectedEmojiInfo(highlight)}
        {suggestionsChunk.map((_suggestions, row) => {
          const elements = _suggestions.map((emoji, column) => {
            const selected = (emoji as BaseEmoji).native;
            const index = row * columnMax + column;
            const emojiClass = classNames("emoji", {
              selected: index === selectedEmojiIndex,
            });
            return (
              <span
                key={emoji.id}
                className={emojiClass}
                onMouseOver={() =>
                  setState({ ...state, selectedEmojiIndex: index })
                }
                onClick={() => {
                  if (suggestions.length > 0) {
                    enterEmoji();
                  }
                }}
              >
                {selected}
              </span>
            );
          });
          const emojiSetKey = _suggestions
            .map((emoji) => (emoji as BaseEmoji).native)
            .join();
          return (
            <p key={emojiSetKey} className={classNames("emoji", "line")}>
              {elements}
            </p>
          );
        })}
      </div>
    );
  }

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

  const enterEmoji = () => {
    const emoji = (suggestions[selectedEmojiIndex] as BaseEmoji).native;
    const cursor = text.indexOf(editingEmoji) + emoji.length + 1;

    setState({
      ...state,
      text: text.replace(editingEmoji, `${emoji} `),
      editingEmoji: "",
      suggestions: [],
    });

    setTextAreaCursor(cursor);
  };

  const actionButtonElement =
    !isShowPicker && suggestions.length === 0 ? (
      <div>
        <button
          className={classNames("action_button")}
          onClick={switchShowPicker}
        >
          🎨 (Ctrl + E)
        </button>
        <CopyToClipboard
          text={text}
          onCopy={() => {
            setState({ ...state, copyButtonText: "📋✔️ (Ctrl + C)" });
          }}
        >
          <button className={classNames("action_button", "copy")}>
            {copyButtonText}
          </button>
        </CopyToClipboard>
      </div>
    ) : null;

  return (
    <div className="App">
      <textarea
        autoFocus={true}
        value={text}
        onChange={handleChange}
        ref={textAreaEl}
        rows={3}
        cols={40}
        placeholder={
          ": (colon) followed by the first few letters of the emoji !\n :+1:, :cat:, :hand: and so on. 😉👉"
        }
        onClick={() =>
          setState({
            ...state,
            copyButtonText: "📋 (Ctrl + C)",
            isShowPicker: false,
          })
        }
        onKeyDown={(e) => {
          if(e.ctrlKey || e.metaKey) {
            if(e.key === 'w' || e.key === 'o' || e.key === 'O') {
              window.close();
              return;
            }
          }

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
        }}
        onKeyPress={(e) => {
          switch (e.key) {
            case "Enter":
              if (suggestions.length > 0) {
                enterEmoji();
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
        }}
      />
      {suggestsElement}
      {actionButtonElement}
      {state.isShowPicker ? (
        <div id="custom_picker">
          <p className={classNames("caution", "emoji_picker_margin")}>
            To close the emoji picker, type Ctrl + E or click on the text area.
          </p>
          <Picker
            emoji={""}
            title={"Teemo 💕"}
            showSkinTones={false}
            autoFocus
            enableFrequentEmojiSort
            onSelect={(emoji) => {
              const element = textAreaElement();
              const before = text.slice(0, element.selectionStart);
              const native = (emoji as BaseEmoji).native;
              const after = text.slice(element.selectionStart);

              const newText = `${before}${native} ${after}`;

              setState({
                ...state,
                text: newText,
                editingEmoji: "",
                suggestions: [],
                copyButtonText: "📋 (Ctrl + C)",
              });

              setTextAreaCursor(before.length + native.length + 1);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
