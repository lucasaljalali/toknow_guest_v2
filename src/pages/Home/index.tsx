import { MouseEvent, useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import QueueFilter from "../../components/Filter/QueueFilter";
import QueueLongCard from "../../components/QueueCard/QueueLongCard";
import TopBar from "../../components/TopBar/TopBar";

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
      onDrag: ({ offset: [dy], target }) => {
        const draggedCard = document.getElementById(String(clickedCard)) || (target as HTMLElement).parentElement;
        if (draggedCard) {
          draggedCard.style.left = `${dy}px`;
        }
      },
      onDragEnd: ({ offset: [dy], target }) => {
        const draggedCard = document.getElementById(String(clickedCard)) || (target as HTMLElement).parentElement;
        if (draggedCard) {
          const isToRemove = dy >= 200 || dy <= -200;
          if (isToRemove) {
            handleRemoveDeviceOfQueue(clickedCard, 6, 1, 6);
          } else {
            draggedCard.style.left = `${0}px`;
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
      handleRemoveDeviceOfQueue(clientData?.id, 6, clientData?.currentDestinationId, 6);
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
            <div id={String(clientData.id)} style={{ position: "relative" }} onClick={(e) => handleClick(e, clientData)}>
              <QueueLongCard key={clientData.id} data={clientData} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
