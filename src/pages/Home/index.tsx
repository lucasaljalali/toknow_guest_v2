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

        if (draggedCard) {
          draggedCard.style.left = `${dy}px`;

          const isToRemove = Math.abs(dy) > window.innerWidth / 5;
          const trashes = document.querySelectorAll(".queueHiddenTrash");
          if (isToRemove) {
            trashes.forEach((trash) => trash.classList.add("bigTrash"));
          } else {
            trashes.forEach((trash) => trash.classList.remove("bigTrash"));
          }
        }
      },
      onDragEnd: ({ movement: [dy], target }) => {
        const draggedCard = document.getElementById(String(clickedCard)) || (target as HTMLElement).parentElement;

        if (draggedCard) {
          const isToRemove = Math.abs(dy) > window.innerWidth / 5;

          if (isToRemove) {
            const cardId = clickedCard || Number(draggedCard?.getAttribute("id"));
            handleRemoveDeviceOfQueue(cardId, 6, 1, 6);
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

      <div className="queueContainer" ref={queueContainerRef} style={{ touchAction: "none" }}>
        <QueueFilter />
        {queue?.map((clientData) => (
          <div key={clientData.id} className="queueHiddenTrashContainer" onClick={() => (clickedCard = clientData.id)}>
            <DeleteForeverIcon id="queueHiddenLeftTrash" className="queueHiddenTrash" />
            <DeleteForeverIcon id="queueHiddenRightTrash" className="queueHiddenTrash" />
            <div id={String(clientData.id)} style={{ position: "relative" }} onClick={(e) => handleClick(e, clientData)}>
              <QueueLongCard key={clientData.id} data={clientData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
