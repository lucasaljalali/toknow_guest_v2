import { Typography } from "@mui/material";
import { queueCardSize } from "../../store/signalsStore";
import { useEffect } from "react";
import { useQueue } from "../../hooks/useQueue";
import { useQueryClient } from "react-query";
import { filterQueue } from "../../pages/Home/utils/handleFilterQueue";
import SwipeableCard from "../QueueSwipeableCard/QueueSwipeableCard";
import Loading from "../Loading/Loading";

export default function Queue() {
  const { queue, isLoading } = useQueue();

  const queryClient = useQueryClient();

  const filteredQueue = filterQueue(queue);

  useEffect(() => {
    queryClient.invalidateQueries(["config"]);
  }, [queue]);

  return (
    <div className={`queueContainer`}>
      {isLoading && <Loading />}
      {queue?.length === 0 ? (
        <Typography className="emptyQueueMessage">{"EMPTY QUEUE"}</Typography>
      ) : (
        <div className={`queueList ${queueCardSize.value}`}>
          {filteredQueue?.map((clientData) => (
            <SwipeableCard key={clientData.id} data={clientData} />
          ))}
        </div>
      )}
    </div>
  );
}
