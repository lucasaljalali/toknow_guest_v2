import QueueFilter from "../../components/Filter/QueueFilter";
import QueueLongCard from "../../components/QueueCard/QueueLongCard";
import TopBar from "../../components/TopBar/TopBar";

export default function Home() {
  const queue = [{ id: 1 }, { id: 2 }, { id: 3 }];

  return (
    <div className="pageContainer">
      <TopBar />

      <div className="queueContainer">
        <QueueFilter />
        {queue.map((clientData) => (
          <QueueLongCard key={clientData.id} data={clientData} />
        ))}
      </div>
    </div>
  );
}
