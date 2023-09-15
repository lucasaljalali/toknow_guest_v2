import { useEffect, useMemo, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import QueueFilter from "../../components/Filter/QueueFilter";
import QueueLongCard from "../../components/QueueCard/QueueLongCard";
import TopBar from "../../components/TopBar/TopBar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function Home() {
  const { queue, notifyQueue, notifyQueueRequestBody } = useQueue();
  const { refetchConfigs } = useCompany();

  useEffect(() => {
    refetchConfigs();
  }, [queue]);

  const memoizedSwipeableList = useMemo(() => {
    return <SwipeableList queue={queue} onRemove={handleRemoveDeviceOfQueue} />;
  }, [queue]);

  function SwipeableCard({ clientData, onRemove }: { clientData: InQueueItem; onRemove: Function }) {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const bind = useGesture(
      {
        onDrag: ({ movement: [dx], last }) => {
          const isToRemoveLeft = dx < -window.innerWidth / 4;
          const isToRemoveRight = dx > window.innerWidth / 4;

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
              if (isToRemoveLeft || isToRemoveRight) {
                onRemove(clientData.id, 6, clientData.currentDestinationId, 6);
                if (redBackground) redBackground.style.opacity = "0";
                cardRef.current.style.left = isToRemoveLeft ? `-${window.innerWidth}px` : `${window.innerWidth}px`;
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
      <div className="queueHiddenTrashContainer">
        <DeleteForeverIcon className="queueHiddenTrash" />
        <div ref={cardRef} id={String(clientData.id)} className="allCardsTypesContainer" {...bind()}>
          <QueueLongCard key={clientData.id} data={clientData} />
        </div>
      </div>
    );
  }

  function SwipeableList({ queue, onRemove }: { queue: InQueueItem[]; onRemove: Function }) {
    return (
      <div className="queueContainer">
        <QueueFilter />
        {queue?.map((clientData) => (
          <SwipeableCard key={clientData.id} clientData={clientData} onRemove={onRemove} />
        ))}
      </div>
    );
  }

  function handleRemoveDeviceOfQueue(queueId?: string | number, actionId?: number, destinationId?: number, messageId?: number) {
    if (queueId) {
      notifyQueueRequestBody.current = { id: queueId, actionId: actionId, destinationId: destinationId, messageId: messageId };
      notifyQueue();
    }
  }

  return (
    <div className="pageContainer">
      <TopBar />
      {memoizedSwipeableList}
    </div>
  );
}
