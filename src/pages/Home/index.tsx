import { MouseEvent, useEffect, useRef } from "react";
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
  const queueContainerRef = useRef(null);
  let clickedCard: number;

  useEffect(() => {
    refetchConfigs();
  }, [queue]);

  useGesture(
    {
      onDrag: ({ movement: [dy], target }) => {
        const draggedCard = document.getElementById(String(clickedCard)) || (target as HTMLElement).parentElement;
        const dragLeftThreshold = dy < -50;
        const dragRightThreshold = dy > 50;
        const isToRemoveLeft = dy < window.innerWidth / -5;
        const isToRemoveRight = dy > window.innerWidth / 5;
        const trash = (draggedCard?.querySelector(".queueHiddenTrash") ||
          draggedCard?.parentElement?.querySelector(".queueHiddenTrash")) as HTMLElement;

        if (draggedCard && (dragLeftThreshold || dragRightThreshold)) {
          draggedCard.style.left = `${dragLeftThreshold ? dy + 50 + 1 : dy - 50 + 1}px`;

          if (trash) {
            trash.style.display = "block";
            if (dragLeftThreshold) {
              trash.style.right = "3rem";
              trash.style.left = "unset";
            }

            if (dragRightThreshold) {
              trash.style.right = "unset";
              trash.style.left = "3rem";
            }

            if (isToRemoveLeft || isToRemoveRight) {
              trash.style.fontSize = "3rem";
            } else {
              trash.style.fontSize = "2rem";
            }
          }
        }
      },
      onDragEnd: ({ movement: [dy], target }) => {
        const draggedCard = document.getElementById(String(clickedCard)) || (target as HTMLElement).parentElement;
        const redBackground = draggedCard?.parentElement;

        const dragLeftThreshold = dy < -50;
        const dragRightThreshold = dy > 50;
        const isToRemoveLeft = dy < window.innerWidth / -5;
        const isToRemoveRight = dy > window.innerWidth / 5;

        if (draggedCard && (dragLeftThreshold || dragRightThreshold)) {
          if (isToRemoveLeft || isToRemoveRight) {
            const cardId = clickedCard || Number(draggedCard?.getAttribute("id"));
            if (redBackground) redBackground.style.opacity = "0";
            handleRemoveDeviceOfQueue(cardId, 6, 1, 6);

            if (isToRemoveLeft) {
              draggedCard.style.transition = ".3s";
              draggedCard.style.left = `-${window.innerWidth}px`;
              setTimeout(() => {
                draggedCard.style.transition = "unset";
              }, 300);
            }

            if (isToRemoveRight) {
              draggedCard.style.transition = ".3s";
              draggedCard.style.left = `${window.innerWidth}px`;
              setTimeout(() => {
                draggedCard.style.transition = "unset";
              }, 300);
            }
          } else {
            draggedCard.style.transition = ".3s";
            draggedCard.style.left = `${0}px`;
            setTimeout(() => {
              draggedCard.style.transition = "unset";
            }, 300);
          }
        }
      },
    },
    {
      target: queueContainerRef,
    }
  );

  function handleClick(event: MouseEvent, clientData: InQueueItem) {
    clickedCard = clientData.id;
    if (event.detail === 2) {
      console.log(clientData);
    }
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

      <div className="queueContainer" ref={queueContainerRef}>
        <QueueFilter />
        {queue?.map((clientData) => (
          <div key={clientData.id} className="queueHiddenTrashContainer" onClick={() => (clickedCard = clientData.id)}>
            <DeleteForeverIcon className="queueHiddenTrash" />
            <div id={String(clientData.id)} className="allCardsTypesContainer" onClick={(e) => handleClick(e, clientData)}>
              <QueueLongCard key={clientData.id} data={clientData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
