import React from "react";
import classNames from "classnames";

import { useCallback, useState, MouseEvent } from "react";

interface ActionButtonAreaProps {
  hidden?: boolean;
  copied: boolean;
  onClick: (type: "reset" | "pallet" | "copy") => void;
}

const ActionButtonArea: React.FunctionComponent<ActionButtonAreaProps> = (
  props,
) => {
  const [caption, setCaption] = useState("");
  const [showCaption, setShowCaption] = useState(false);

  const onClickButton = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const actionType = event.currentTarget.dataset.action as
        | "reset"
        | "pallet"
        | "copy";
      props.onClick(actionType);
    },
    [props],
  );

  const updateCaption = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const actionType = event.currentTarget.dataset.action;
    showCaptionForAction(actionType);
  }, []);

  const updateCaptionByFocus = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      const actionType = event.currentTarget.dataset.action;
      showCaptionForAction(actionType);
    },
    [],
  );

  const showCaptionForAction = (actionType?: string | null) => {
    switch (actionType) {
      case "reset":
        setCaption("Clear textarea. 🆕 (Ctrl + R)");
        break;
      case "pallet":
        setCaption("Toggle open or close the emoji picker . 🎨 (Ctrl + E)");
        break;
      case "copy":
        setCaption("Copy the text you are typing. 📋 (Ctrl + C)");
        break;
      default:
        setCaption("");
    }
    setShowCaption(true);
  };

  const clearCaption = useCallback(() => {
    setShowCaption(false);
  }, []);

  return (
    <div
      className="action_button_area action-button-area"
      style={{ display: props.hidden ? "none" : undefined }}
    >
      <div className="action_button_group">
        <button
          className={classNames("action_button", "reset")}
          data-action="reset"
          onClick={onClickButton}
          onMouseEnter={updateCaption}
          onFocus={updateCaptionByFocus}
          onMouseLeave={clearCaption}
          onBlur={clearCaption}
          aria-label="テキストエリアをクリア (Ctrl + R)"
        >
          🆕
        </button>
        <button
          className={classNames("action_button", "pallet")}
          data-action="pallet"
          onClick={onClickButton}
          onMouseEnter={updateCaption}
          onFocus={updateCaptionByFocus}
          onMouseLeave={clearCaption}
          onBlur={clearCaption}
          aria-label="絵文字パレットを開閉 (Ctrl + E)"
        >
          🎨
        </button>
        <button
          className={classNames("action_button", "copy")}
          data-action="copy"
          onClick={onClickButton}
          onMouseEnter={updateCaption}
          onFocus={updateCaptionByFocus}
          onMouseLeave={clearCaption}
          onBlur={clearCaption}
          aria-label="テキストをコピー (Ctrl + C)"
        >
          {props.copied ? "✅" : "📋"}
        </button>
      </div>
      <p
        className={classNames("action_button_caption", {
          visible: showCaption,
        })}
      >
        {caption}
      </p>
    </div>
  );
};

export default ActionButtonArea;
