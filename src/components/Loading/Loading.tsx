import loadingGif from "../../assets/images/loading.gif";
import "./Loading.css";

interface ILoading {
  size?: number;
}

export default function Loading({ size }: ILoading) {
  return (
    <div className="loadingContainer" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={loadingGif} alt="loading" style={{ width: `${size}rem`, height: `${size}rem` }} />
    </div>
  );
}
