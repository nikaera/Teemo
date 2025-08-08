/* global window, document, navigator, setTimeout, process, chrome */
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useEffect, useState, useCallback, useRef } from "react";

import ActionButtonArea from "./components/ActionButtonArea";
import AuroraBackground from "./components/AuroraBackground";
import { EmojiTextArea } from "@nikaera/react-emoji-textarea";

import "./App.css";

const App: React.FunctionComponent = () => {
  const textAreaEl = useRef<HTMLTextAreaElement>(null);
  const [state, setState] = useState({
    isExistSuggests: false,
    isShowPicker: false,
    isCopied: false,
    showCopiedLabel: false,
    textFocus: false,
  });
  const {
    isExistSuggests,
    isShowPicker,
    isCopied,
    showCopiedLabel,
    textFocus,
  } = state;

  useHotkeys("ctrl+w,cmd+shift+o,ctrl+shift+o", () => window.close());
  useHotkeys("ctrl+e,cmd+e", () => switchShowPicker());
  useHotkeys("ctrl+c,cmd+c", () => void copyTextAreaText());
  useHotkeys("ctrl+r,cmd+r", () => clearTextAreaText());
  useHotkeys("esc", () => showDefaultUI());

  const showDefaultUI = () => {
    setState((prev) => ({
      ...prev,
      isShowPicker: false,
      isExistSuggests: false,
      isCopied: false,
    }));
    textAreaEl.current?.focus();
  };

  const switchShowPicker = () => {
    setState((prev) => ({
      ...prev,
      isShowPicker: !prev.isShowPicker,
      isCopied: false,
    }));
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

  const copyTextAreaText = async () => {
    if (textAreaEl.current) {
      const element = textAreaEl.current;
      const currentCursor = element.selectionStart;
      try {
        await navigator.clipboard.writeText(element.value);
        setTextAreaCursor(currentCursor);
        setState((prev) => ({
          ...prev,
          isCopied: true,
          showCopiedLabel: true,
        }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, showCopiedLabel: false }));
        }, 1200);
      } catch {
        // Fallback: 旧方式（非推奨だが一部ブラウザで必要な場合）
        try {
          element.select();
          document.execCommand("copy");
          setTextAreaCursor(currentCursor);
          setState((prev) => ({
            ...prev,
            isCopied: true,
            showCopiedLabel: true,
          }));
          setTimeout(() => {
            setState((prev) => ({ ...prev, showCopiedLabel: false }));
          }, 1200);
        } catch {
          setState((prev) => ({
            ...prev,
            isCopied: false,
            showCopiedLabel: false,
          }));
        }
      }
    }
  };

  useEffect(() => {
    const onDetectHotKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "e") {
          switchShowPicker();
          e.preventDefault();
        } else if (e.key === "c") {
          void copyTextAreaText();
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
  }, []);
  useEffect(() => {
    const el = textAreaEl.current;
    if (!el) return;
    const handleFocus = () =>
      setState((prev) => ({ ...prev, textFocus: true }));
    const handleBlur = () =>
      setState((prev) => ({ ...prev, textFocus: false }));
    el.addEventListener("focus", handleFocus);
    el.addEventListener("blur", handleBlur);

    el.focus();
    return () => {
      el.removeEventListener("focus", handleFocus);
      el.removeEventListener("blur", handleBlur);
    };
  }, [textAreaEl.current]);

  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
          void copyTextAreaText();
          break;
      }
    },
    [],
  );

  const onClick = useCallback(
    () => setState((prev) => ({ ...prev, isShowPicker: false })),
    [],
  );
  const onChange = useCallback(
    () =>
      setState((prev) => ({ ...prev, isShowPicker: false, isCopied: false })),
    [],
  );

  // textarea以外クリック時にフォーカスを当てる
  const appRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleAppClick = (e: MouseEvent) => {
      // ActionButtonAreaやEmojiPickerなど特定要素は除外
      const target = e.target as HTMLElement;
      // EmojiTextArea, ActionButtonArea, Picker, CopiedLabel などは除外
      if (
        target.closest('.action-button') // ActionButtonAreaのラッパーにclassを付与している前提
        || target.closest('em-emoji-picker') // EmojiTextAreaのラッパーにclassを付与している前提
      ) {
        return;
      }
      // それ以外はtextareaにフォーカス
      textAreaEl.current?.focus();
    };
    const appEl = appRef.current;
    if (appEl) {
      appEl.addEventListener('click', handleAppClick);
    }
    return () => {
      if (appEl) {
        appEl.removeEventListener('click', handleAppClick);
      }
    };
  }, [textAreaEl.current]);

  return (
    <AuroraBackground>
      <div className="App" ref={appRef}>
        <div className="teemo-main">
          <div className={`teemo-textarea-wrap${textFocus ? " focused" : ""}`}> 
            <EmojiTextArea
              ref={textAreaEl}
              showPicker={isShowPicker}
              onChange={onChange}
              onClick={onClick}
              onClickOutside={showDefaultUI}
              placeholder={
                ": (colon) followed by the first few letters of the emoji !\n :+1:, :cat:, :hand: and so on. 😉👉"
              }
            />
            {showCopiedLabel && (
              <span className="teemo-copied-label">Copied!</span>
            )}
          </div>
          <ActionButtonArea
            hidden={isShowPicker || isExistSuggests}
            copied={isCopied}
            onClick={onClickActionButton}
          />
          {isShowPicker && (
            <p className="action_button_caption">
              To close the emoji picker, type Ctrl + E or click on the text area. 🎨
            </p>
          )}
        </div>
      </div>
    </AuroraBackground>
  );
};

export default App;
