import { useEffect, useRef } from "react";
import { Alert, AlertColor, Snackbar, styled } from "@mui/material";
import { useGesture } from "@use-gesture/react";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import { ITransformedInQueueData, transformInQueueData } from "./utils/transformInQueueData";
import { filtersOpen, filtersSelection, sideDrawerOpen } from "../../store/signalsStore";
import QueueCard from "../../components/QueueCard/QueueCard";
import TopBar from "../../components/TopBar/TopBar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RightDrawer from "../../components/RightDrawer/RightDrawer";
import QueueOrdinations from "../../components/Ordinations/QueueOrdinations";

export default function Home() {
  // const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { queue, notifyQueue, notifyQueueRequestBody, queueAlert, setQueueAlert } = useQueue();
  const { refetchConfigs, companyConfigs } = useCompany();

  const transformedQueue = queue?.map((queueItem) => transformInQueueData(queueItem, companyConfigs));

  const filteredQueue = transformedQueue?.filter((transformedQueueItem) => {
    const filteredProps = Object.keys(filtersSelection.value);

    const matches = filteredProps?.filter((prop) => {
      const filteredValue = filtersSelection.value[prop] as any[];

      let transformedQueueItemValue = transformedQueueItem[prop as keyof ITransformedInQueueData];

      if (Array.isArray(transformedQueueItemValue)) {
        return transformedQueueItemValue?.find((value) => filteredValue?.includes(value));
      } else {
        return filteredValue.includes(transformedQueueItemValue);
      }
    });

    return matches.length === filteredProps.length;
  });

  const cardData = useRef<ITransformedInQueueData | null>(null);

  const drawerWidth = document?.getElementById("rightDrawer")?.querySelector(".MuiPaper-root")?.clientWidth;

  const doubleTouchThreshold = 300;
  let firstTouchTimestamp = 0;

  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
  }>(({ theme, open }) => ({
    minHeight: "100vh",
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: 0,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: drawerWidth && `${drawerWidth}px`,
    }),
  }));

  useEffect(() => {
    refetchConfigs();
  }, [queue]);

  function SwipeableCard({ clientData, onRemove }: { clientData: InQueueItem; onRemove: Function }) {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const transformedData = transformInQueueData(clientData, companyConfigs);

    const bind = useGesture(
      {
        onTouchEnd: ({ event }) => {
          event.preventDefault();
          event.stopPropagation();
          if (firstTouchTimestamp === 0) {
            firstTouchTimestamp = event.timeStamp;
          } else {
            const timeDifference = event.timeStamp - firstTouchTimestamp;

            if (timeDifference <= doubleTouchThreshold) {
              // This is a double touch
              handleCardDoubleClick(event, transformedData);
              // Reset the timestamp
              firstTouchTimestamp = 0;
              return;
            }
          }
          // If it's not a double touch, reset the timestamp
          firstTouchTimestamp = event.timeStamp;
        },

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
                onRemove(transformedData.id, 6, transformedData.currentDestinationId, 6);
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
        <div
          ref={cardRef}
          id={String(transformedData.id)}
          className="allCardsTypesContainer"
          style={{ touchAction: "pan-y" }}
          {...bind()}
          onClick={(e) => handleCardClick(e, transformedData)}
        >
          <QueueCard key={transformedData.id} data={transformedData} />
        </div>
      </div>
    );
  }

  function SwipeableList({ queue, onRemove }: { queue: InQueueItem[]; onRemove: Function }) {
    return (
      <div className="queueContainer">
        <QueueOrdinations />
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

  function handleCardClick(event: any, data: ITransformedInQueueData) {
    event.preventDefault();
    event.stopPropagation();
    if (filtersOpen.value === true) {
      filtersOpen.value = false;
    }
    if (event.detail === 2) {
      handleCardDoubleClick(event, data);
    }
  }

  function handleCardDoubleClick(event: any, data: ITransformedInQueueData) {
    event.preventDefault();
    event.stopPropagation();
    cardData.current = data;
    sideDrawerOpen.value = !sideDrawerOpen.value;
  }

  return (
    <>
      <Main open={sideDrawerOpen.value}>
        <TopBar />

        <SwipeableList queue={filteredQueue} onRemove={handleRemoveDeviceOfQueue} />

        <Snackbar open={queueAlert !== null} autoHideDuration={6000} onClose={() => setQueueAlert(null)}>
          <Alert variant="filled" severity={queueAlert ? (Object.keys(queueAlert)[0] as AlertColor) : undefined}>
            {queueAlert?.[Object.keys(queueAlert)[0]]}
          </Alert>
        </Snackbar>
      </Main>

      <RightDrawer cardData={cardData} />
    </>
  );
}
