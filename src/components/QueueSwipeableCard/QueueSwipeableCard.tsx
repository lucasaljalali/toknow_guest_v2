import { useRef } from "react";
import { transformInQueueData } from "../../pages/Home/utils/transformInQueueData";
import { InQueueItem } from "../../services/api/dtos/Queue";
import { useGesture } from "@use-gesture/react";
import {
  cardData,
  filtersOpen,
  isDragging,
  notificationDrawerOpen,
  queueCardSize,
  sideDrawerOpen,
  windowWidth,
} from "../../store/signalsStore";
import { useQueue } from "../../hooks/useQueue";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import QueueCard from "../QueueCard/QueueCard";

interface ISwipeableCard {
  data: InQueueItem;
}

const doubleTouchThreshold = 300;
let firstTouchTimestamp = 0;

export default function SwipeableCard({ data }: ISwipeableCard) {
  const { notifyQueue } = useQueue();

  const cardRef = useRef<HTMLDivElement | null>(null);

  const transformedData = data ? transformInQueueData(data) : null;

  const bind = useGesture(
    {
      onMouseDown: () => (cardData.value = transformedData),
      onTouchStart: () => (cardData.value = transformedData),
      onClick: ({ event }) => {
        console.log("click");
        event.preventDefault();

        if (sideDrawerOpen.value) event.stopPropagation();

        if (filtersOpen.value === true) {
          filtersOpen.value = false;
        }
        if (event.detail === 2) {
          sideDrawerOpen.value = !sideDrawerOpen.value;
        }
      },
      onTouchEnd: ({ event }) => {
        console.log("touchEnd");
        event.preventDefault();
        queueCardSize.value !== "small" && event.stopPropagation();

        if (firstTouchTimestamp === 0) {
          firstTouchTimestamp = event.timeStamp;
        } else {
          const timeDifference = event.timeStamp - firstTouchTimestamp;

          if (timeDifference <= doubleTouchThreshold) {
            // This is a double touch
            sideDrawerOpen.value = !sideDrawerOpen.value;
            // Reset the timestamp
            firstTouchTimestamp = 0;
            return;
          }
        }
        // If it's not a double touch, reset the timestamp
        firstTouchTimestamp = event.timeStamp;
      },

      onDrag: ({ movement: [dx], last }) => {
        if (sideDrawerOpen.value || notificationDrawerOpen.value) return;

        if (isDragging.value === false) isDragging.value = true;

        const cardWidth = cardRef.current?.clientWidth || window.innerWidth;
        const isToRemoveDivider = queueCardSize.value === "small" ? 1.5 : 4;
        const isToRemoveLeft = dx < -cardWidth / isToRemoveDivider;
        const isToRemoveRight = dx > cardWidth / isToRemoveDivider;

        if (cardRef.current) {
          const redBackground = cardRef.current.parentElement;
          const trash = redBackground && (redBackground?.querySelector(".queueHiddenTrash") as HTMLElement);
          if (trash) {
            trash.style.right = dx > 0 ? "unset" : "4rem";
            trash.style.left = dx < 0 ? "unset" : "4rem";
            trash.style.transform = `translate(${dx > 0 ? "-50%" : "50%"},-50%)`;
            trash.style.fontSize = isToRemoveLeft || isToRemoveRight ? "3rem" : "1.5rem";
          }

          cardRef.current.style.transform = `translateX(${dx}px)`;

          if (last) {
            isDragging.value = false;
            if (isToRemoveLeft || isToRemoveRight) {
              if (transformedData?.id) {
                const dataToSubmit = {
                  id: transformedData.id,
                  actionId: 6,
                  destinationId: transformedData.currentDestinationId,
                  messageId: 6,
                };
                notifyQueue(dataToSubmit);
              }

              if (redBackground) redBackground.style.opacity = "0";
              cardRef.current.style.left = isToRemoveLeft ? `-${windowWidth.value}px` : `${windowWidth.value}px`;
            } else {
              cardRef.current.style.transition = ".3s";
              cardRef.current.style.transform = `translateX(${0}px)`;
              setTimeout(() => {
                if (cardRef.current) cardRef.current.style.transition = "unset";
              }, 300);
            }
          }
        }
      },
    },
    {
      drag: {
        axis: "x",
      },
    }
  );

  return (
    <div className={`queueHiddenTrashContainer ${queueCardSize.value}`}>
      <DeleteForeverIcon className="queueHiddenTrash" />
      <div
        ref={cardRef}
        id={String(transformedData?.id)}
        className="allCardsTypesContainer"
        style={{ touchAction: "pan-y", boxShadow: queueCardSize.value === "small" ? "none" : undefined }}
        {...bind()}
      >
        <QueueCard key={transformedData?.id} data={transformedData} />
      </div>
    </div>
  );
}
