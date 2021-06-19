import classNames from "classnames";
import { EmojiData, BaseEmoji } from "emoji-mart";

import { useCallback } from "react";

interface SuggestAreaProps {
  highlight?: string;
  suggestions: Array<EmojiData>;
  emojiIndex: number;
  onOverEmojiIndex: (index: number) => void;
  onSelect: (emoji: EmojiData) => void;
}

const SuggestArea: React.FunctionComponent<SuggestAreaProps> = (props) => {
  const columnMax = 9;

  const { emojiIndex, highlight, suggestions, onOverEmojiIndex, onSelect } =
    props;

  // ref: https://www.nxworld.net/js-array-chunk.html
  const arrayChunk = ([...array]: EmojiData[], size = 1): EmojiData[][] => {
    return array.reduce(
      (acc, _, index) =>
        index % size ? acc : [...acc, array.slice(index, index + size)],
      [] as EmojiData[][]
    );
  };

  const selectEmojiIndex = () => emojiIndex; //_emojiIndex === -1 ? emojiIndex : _emojiIndex

  const selectedEmojiInfo = (highlight: string) => {
    const emojiIndex = selectEmojiIndex();
    const emoji = suggestions[emojiIndex] as BaseEmoji | null;
    if (emoji) {
      const { short_names } = suggestions[emojiIndex] as {
        short_names: string[];
      };
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
  const onClick = useCallback(() => {
    if (suggestions.length > 0) {
      onSelect(suggestions[emojiIndex]);
    }
  }, [suggestions]);

  if (suggestions.length > 0) {
    const emojiIndex = selectEmojiIndex();
    const suggestionsChunk = arrayChunk(suggestions, columnMax);
    suggestsElement = (
      <div>
        {highlight ? selectedEmojiInfo(highlight) : null}
        {suggestionsChunk.map((_suggestions, row) => {
          const elements = _suggestions.map((emoji, column) => {
            const selected = (emoji as BaseEmoji).native;
            const index = row * columnMax + column;
            const emojiClass = classNames("emoji", {
              selected: index === emojiIndex,
            });
            return (
              <span
                key={emoji.id}
                className={emojiClass}
                onMouseOver={() => onOverEmojiIndex(index)}
                onClick={onClick}
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

  return suggestsElement;
};

export default SuggestArea;
