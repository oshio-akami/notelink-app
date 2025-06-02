/**dateからフォーマットを生成する関数 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("ja", { numeric: "auto" });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  if (diff < 60) {
    return rtf.format(-Math.floor(diff), "seconds");
  } else if (diff < 3600) {
    return rtf.format(-Math.floor(diff / 60), "minutes");
  } else if (diff < 86400) {
    return rtf.format(-Math.floor(diff / 3600), "hours");
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日${hours}:${minutes}`;
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

type ShortPressOptions = {
  maxDurationMs?: number;
};

/**
 * 一定時間以下のクリック
 */
export function withShortPress(
  handler: (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void,
  options: ShortPressOptions = {}
) {
  const { maxDurationMs = 200 } = options;
  let pressStart = 0;

  const onMouseDown = () => {
    pressStart = Date.now();
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() - pressStart < maxDurationMs) {
      handler(e);
    }
  };

  const onTouchStart = () => {
    pressStart = Date.now();
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (Date.now() - pressStart < maxDurationMs) {
      handler(e);
    }
  };

  return {
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
  };
}
