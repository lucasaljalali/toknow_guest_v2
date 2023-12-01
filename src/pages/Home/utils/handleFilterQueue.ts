import { InQueueItem } from "../../../services/api/dtos/Queue";
import { filtersSelection } from "../../../store/signalsStore";
import { ITransformedInQueueData, transformInQueueData } from "./transformInQueueData";

export function filterQueue(queue?: InQueueItem[]) {
  const transformedQueue = queue?.map((queueItem) => transformInQueueData(queueItem));

  const filteredQueue = transformedQueue?.filter((transformedQueueItem) => {
    const filteredProps = Object.keys(filtersSelection.value);

    const matches = filteredProps?.filter((prop) => {
      const filteredValue = filtersSelection.value[prop] as any[];

      let transformedQueueItemValue = transformedQueueItem?.[prop as keyof ITransformedInQueueData];

      if (Array.isArray(transformedQueueItemValue)) {
        return transformedQueueItemValue?.find((value) => filteredValue?.includes(value));
      } else {
        return filteredValue.includes(transformedQueueItemValue);
      }
    });

    return matches.length === filteredProps.length;
  });

  return filteredQueue;
}
