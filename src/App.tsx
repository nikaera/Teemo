import { useHotkeys } from "react-hotkeys-hook";

import { useEffect, useState, useCallback, createRef } from "react";

import EmojiTextArea from "./components/EmojiTextArea";
import ActionButtonArea from "./components/ActionButtonArea";

import "./App.css";

const App: React.FunctionComponent = () => {
  const textAreaEl = createRef<HTMLTextAreaElement>();
  const [state, setState] = useState({
    text: "",
    isExistSuggests: false,
    isShowPicker: false,
  });

  const { isExistSuggests, text, isShowPicker } = state;

  useHotkeys("ctrl+w,cmd+shift+o,ctrl+shift+o", () => window.close());
  useHotkeys("ctrl+c,cmd+c", () => copyTextAreaText());
  useHotkeys("ctrl+r,cmd+r", () => clearTextAreaText());
  useHotkeys("esc", () => showDefaultUI());

  const showDefaultUI = () => {
    setState({
      ...state,
      isShowPicker: false,
      isExistSuggests: false,
    });
  };

  const clearTextAreaText = () => {
    if (textAreaEl.current) {
      const element = textAreaEl.current;
      element.value = "";
    }
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
    }
  };

  useEffect(() => {
    const onDetectHotKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        setState({ ...state, isShowPicker: !isShowPicker });
        e.preventDefault();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        copyTextAreaText();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        clearTextAreaText();
      } else if (e.key === "Escape") {
        showDefaultUI();
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "w" || e.key === "o" || e.key === "O") {
          window.close();
          return;
        }
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
          setState({ ...state, isShowPicker: !isShowPicker });
          break;
        case "copy":
          copyTextAreaText();
          break;
      }
    },
    [text]
  );

  const onSuggesting = useCallback(
    (isSuggesting: boolean) =>
      setState({ ...state, isExistSuggests: isSuggesting }),
    []
  );
  const onChange = useCallback(
    (text: string) => setState({ ...state, text }),
    []
  );

  return (
    <div className="App">
      <EmojiTextArea
        ref={textAreaEl}
        showPicker={isShowPicker}
        onSuggesting={onSuggesting}
        onChange={onChange}
      />
      <ActionButtonArea
        hidden={isShowPicker || isExistSuggests}
        onClick={onClickActionButton}
      />
    </div>
  );
};

export default App;
