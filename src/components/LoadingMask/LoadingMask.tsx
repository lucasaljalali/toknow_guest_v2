import { Box } from "@mui/material";
import Loading from "../Loading/Loading";

export default function LoadingMask() {
  return (
    <Box className="loadingMask">
      <Loading />
    </Box>
  );
}
