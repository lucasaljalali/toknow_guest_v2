import { MouseEvent, TouchEvent, useEffect, useRef, useState } from "react";
import { Alert, AlertColor, Snackbar, styled } from "@mui/material";
import { useGesture } from "@use-gesture/react";
import { useQueue } from "../../contexts/QueueContext";
import { useCompany } from "../../contexts/CompanyContext";
import { InQueueItem } from "../../services/api/dtos/Queue";
import { ITransformedInQueueData, transformInQueueData } from "./utils/transformInQueueData";
import QueueFilter from "../../components/Filter/QueueFilter";
import QueueCard from "../../components/QueueCard/QueueCard";
import TopBar from "../../components/TopBar/TopBar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RightDrawer from "../../components/RightDrawer/RightDrawer";

export default function Home() {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const { queue, notifyQueue, notifyQueueRequestBody, queueAlert, setQueueAlert } = useQueue();
  const { refetchConfigs, companyConfigs } = useCompany();

  const cardData = useRef<ITransformedInQueueData | null>(null);

  const drawerWidth = document?.getElementById("rightDrawer")?.querySelector(".MuiPaper-root")?.clientWidth;

  const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
  }>(({ theme, open }) => ({
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
        <div ref={cardRef} id={String(clientData.id)} className="allCardsTypesContainer" style={{ touchAction: "pan-y" }} {...bind()}>
          <QueueCard key={clientData.id} data={transformedData} onCardClick={handleCardClick} onDeviceClick={handleDeviceClick} />
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

  function handleCardClick(event: MouseEvent | TouchEvent, data: ITransformedInQueueData) {
    event.stopPropagation();

    if (event.detail === 2) {
      cardData.current = data;
      setSideDrawerOpen((prev) => !prev);
    }
  }

  function handleDeviceClick(event: MouseEvent | TouchEvent, data: InQueueItem) {
    event.stopPropagation();
    if (event.detail === 2) {
      const clickedDevice = event.currentTarget?.querySelector(".deviceIcon");
      clickedDevice?.classList.add("active");
      setTimeout(() => {
        clickedDevice?.classList.remove("active");
      }, 2000);
      handleNotifyDevice(data?.id, 2, data?.currentDestinationId, 2);
    }
  }

  function handleNotifyDevice(queueId?: string | number, actionId?: number, destinationId?: number, messageId?: number) {
    if (queueId) {
      notifyQueueRequestBody.current = { id: queueId, actionId: actionId, destinationId: destinationId, messageId: messageId };
      notifyQueue();
    }
  }

  return (
    <div className="pageContainer">
      <Main open={sideDrawerOpen}>
        <TopBar setSideDrawerOpen={setSideDrawerOpen} />

        <SwipeableList queue={queue} onRemove={handleRemoveDeviceOfQueue} />

        <Snackbar open={queueAlert !== null} autoHideDuration={6000} onClose={() => setQueueAlert(null)}>
          <Alert variant="filled" severity={queueAlert ? (Object.keys(queueAlert)[0] as AlertColor) : undefined}>
            {queueAlert?.[Object.keys(queueAlert)[0]]}
          </Alert>
        </Snackbar>
      </Main>

      <RightDrawer open={sideDrawerOpen} setOpen={setSideDrawerOpen} cardData={cardData} />
    </div>
  );
}
