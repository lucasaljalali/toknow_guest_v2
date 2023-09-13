import { MouseEvent, useEffect } from "react";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import QueueFilter from "../../components/Filter/QueueFilter";
import QueueLongCard from "../../components/QueueCard/QueueLongCard";
import TopBar from "../../components/TopBar/TopBar";

export default function Home() {
  const { queue, notifyQueue, notifyQueueRequestBody } = useQueue();
  const { refetchConfigs } = useCompany();

  useEffect(() => {
    refetchConfigs();
  }, [queue]);

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

      <div className="queueContainer">
        <QueueFilter />
        {queue?.map((clientData) => (
          <div key={clientData.id} className="queueAllCardsContainer" onClick={(e) => handleClick(e, clientData)}>
            <QueueLongCard key={clientData.id} data={clientData} />
          </div>
        ))}
      </div>
    </div>
  );
}
