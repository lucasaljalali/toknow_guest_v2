import { queueCardSize, windowWidth } from "../../../store/signalsStore";
import { TQueueCardSize } from "../../../store/types";

export function handleLimitSize(windowNewInnerWidth: number) {
  const limitSize = () => {
    if (windowNewInnerWidth < 768 && queueCardSize.value === "large") {
      queueCardSize.value = "medium";
    }

    if (windowNewInnerWidth >= 768 && (sessionStorage.getItem("queueCardSize") as TQueueCardSize)) {
      if ((sessionStorage.getItem("queueCardSize") as TQueueCardSize) !== queueCardSize.value)
        queueCardSize.value = sessionStorage.getItem("queueCardSize") as TQueueCardSize;
    }
  };

  windowWidth.value = windowNewInnerWidth;
  limitSize();
}
