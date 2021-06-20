import { useHotkeys } from "react-hotkeys-hook";

import { useEffect, useState, useCallback, createRef } from "react";

import ActionButtonArea from "./components/ActionButtonArea";
import EmojiTextArea from "@nikaera/react-emoji-textarea";

import "./App.css";

const App: React.FunctionComponent = () => {
  const textAreaEl = createRef<HTMLTextAreaElement>();
  const [state, setState] = useState({
    text: "",
    isExistSuggests: false,
    isShowPicker: false,
    isCopied: false,
  });

  const { isExistSuggests, text, isShowPicker, isCopied } = state;

  useHotkeys("ctrl+w,cmd+shift+o,ctrl+shift+o", () => window.close());
  useHotkeys("ctrl+c,cmd+c", () => copyTextAreaText());
  useHotkeys("ctrl+r,cmd+r", () => clearTextAreaText());
  useHotkeys("esc", () => showDefaultUI());

  const showDefaultUI = () => {
    setState({
      ...state,
      isShowPicker: false,
      isExistSuggests: false,
      isCopied: false,
    });
  };

  const switchShowPicker = () => {
    setState({ ...state, isShowPicker: !isShowPicker, isCopied: false });
  };

  const clearTextAreaText = () => {
    window.location.reload();
  };

  const setTextAreaCursor = (cursor: number) => {
    if (textAreaEl.current) {
      const element = textAreaEl.current;
      if (element) {
        element.focus();
        element.selectionStart = cursor;
        element.selectionEnd = cursor;
      }
    }
  };

  const copyTextAreaText = () => {
    if (textAreaEl.current) {
      const element = textAreaEl.current;
      const currentCursor = element.selectionStart;

      element.select();
      document.execCommand("copy");

      setTextAreaCursor(currentCursor);
      setState({ ...state, isCopied: true });
    }
  };

  useEffect(() => {
    const onDetectHotKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "e") {
          switchShowPicker();
          e.preventDefault();
        } else if (e.key === "c") {
          copyTextAreaText();
        } else if (e.key === "r") {
          clearTextAreaText();
        } else if (e.key === "w" || e.key === "o" || e.key === "O") {
          window.close();
          return;
        }
      } else if (e.key === "Escape") {
        showDefaultUI();
      }
    };
    document.addEventListener("keydown", onDetectHotKey);

    return function cleanup() {
      document.removeEventListener("keydown", onDetectHotKey);
    };
  });

  if (process.env.NODE_ENV === "production") {
    chrome.runtime.sendMessage({
      action: "resizeWindow",
      data: { isShowPicker, isSuggesting: isExistSuggests },
    });
  }

  const onClickActionButton = useCallback(
    (type: "reset" | "pallet" | "copy" | "unknown") => {
      switch (type) {
        case "reset":
          clearTextAreaText();
          break;
        case "pallet":
          switchShowPicker();
          break;
        case "copy":
          copyTextAreaText();
          break;
      }
    },
    [text]
  );

  const onClick = useCallback(
    () => setState({ ...state, isShowPicker: false }),
    []
  );
  const onSuggesting = useCallback(
    (isSuggesting: boolean) =>
      setState({ ...state, isExistSuggests: isSuggesting, isCopied: false }),
    []
  );
  const onChange = useCallback(
    (text: string) => setState({ ...state, text, isCopied: false }),
    []
  );

  return (
    <div className="App">
      <EmojiTextArea
        ref={textAreaEl}
        showPicker={isShowPicker}
        onSuggesting={onSuggesting}
        onChange={onChange}
        onClick={onClick}
        emojiPickerProps={{
          emoji: "",
          title: "Teemo 💕",
          showSkinTones: false,
          autoFocus: true,
        }}
        placeholder={
          ": (colon) followed by the first few letters of the emoji !\n :+1:, :cat:, :hand: and so on. 😉👉"
        }
      />
      <ActionButtonArea
        hidden={isShowPicker || isExistSuggests}
        copied={isCopied}
        onClick={onClickActionButton}
      />
      <p
        className={"action_button_caption"}
        style={{ display: isShowPicker ? "" : "none" }}
      >
        To close the emoji picker, type Ctrl + E or click on the text area. 🎨
      </p>
    </div>
  );
};

export default App;
