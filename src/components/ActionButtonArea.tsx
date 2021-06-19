import classNames from "classnames";

import { useCallback, useState, MouseEvent } from "react";

interface ActionButtonAreaProps {
  hidden?: boolean;
  copied: boolean;
  onClick: (type: "reset" | "pallet" | "copy") => void;
}

const ActionButtonArea: React.FunctionComponent<ActionButtonAreaProps> = (
  props
) => {
  const [actionButtonCaption, setActionButtonCaption] = useState("");

  const onClickButton = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const actionType = event.currentTarget.dataset.action as
      | "reset"
      | "pallet"
      | "copy";
    props.onClick(actionType);
  }, []);

  const updateActionButtonCaption = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const actionType = event.currentTarget.dataset.action;
      switch (actionType) {
        case "reset":
          setActionButtonCaption("Clear textarea. 🆕");
          break;
        case "pallet":
          setActionButtonCaption("Toggle open or close the emoji picker . 🎨");
          break;
        case "copy":
          setActionButtonCaption("Copy the text you are typing. 📋");
          break;
      }
    },
    []
  );

  const clearActionButtonCaption = useCallback(
    () => setActionButtonCaption(""),
    []
  );

  return (
    <div style={{ display: props.hidden ? "none" : "" }}>
      <button
        className={classNames("action_button", "reset")}
        data-action={"reset"}
        onClick={onClickButton}
        onMouseEnter={updateActionButtonCaption}
        onMouseLeave={clearActionButtonCaption}
      >
        🆕 (Ctrl + R)
      </button>
      <button
        className={classNames("action_button")}
        data-action={"pallet"}
        onClick={onClickButton}
        onMouseEnter={updateActionButtonCaption}
        onMouseLeave={clearActionButtonCaption}
      >
        🎨 (Ctrl + E)
      </button>
      <button
        className={classNames("action_button", "copy")}
        data-action={"copy"}
        onClick={onClickButton}
        onMouseEnter={updateActionButtonCaption}
        onMouseLeave={clearActionButtonCaption}
      >
        {props.copied ? "✅" : "📋"} (Ctrl + C)
      </button>
      <p className={classNames("caution", "action_button_caption")}>
        {actionButtonCaption}
      </p>
    </div>
  );
};

export default ActionButtonArea;
