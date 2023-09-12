import loadingGif from "../../assets/images/loading.gif";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loadingContainer">
      <img src={loadingGif} alt="loading" />
    </div>
  );
}
