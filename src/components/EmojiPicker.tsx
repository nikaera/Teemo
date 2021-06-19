import classNames from "classnames";
import { Picker, EmojiData } from "emoji-mart";

interface EmojiPickerProps {
  hidden?: boolean;
  onSelect: (emoji: EmojiData) => void;
}

const EmojiPicker: React.FunctionComponent<EmojiPickerProps> = (props) => {
  const { hidden, onSelect } = props;
  return (
    <div style={{ display: hidden ? "none" : "" }} id="custom_picker">
      <p className={classNames("caution", "emoji_picker_margin")}>
        To close the emoji picker, type Ctrl + E or click on the text area.
      </p>
      <Picker
        emoji={""}
        title={"Teemo 💕"}
        showSkinTones={false}
        autoFocus
        enableFrequentEmojiSort
        onSelect={onSelect}
      />
    </div>
  );
};

export default EmojiPicker;
