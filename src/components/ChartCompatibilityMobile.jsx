import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { animate } from "framer-motion";
import * as React from "react";

function CircularProgressWithLabel({ from, to }) {
  const [progress, setProgress] = React.useState(0);
  const nodeRef = React.useRef();

  React.useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 2,
      onUpdate(value) {
        node.textContent = `${Math.round(value)}%`;
        setProgress(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        value={100}
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={60}
        thickness={3}
      />
      <CircularProgress
        value={progress || 0}
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.chartPrimary.default,
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
        }}
        size={60}
        thickness={3}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          ref={nodeRef}
          variant="caption"
          component="div"
          color="text.secondary"
          fontWeight={"bold"}
          fontSize={"15px"}
        />
      </Box>
    </Box>
  );
}

export default function ChartCompatibilityMobile({ movie }) {
  return (
    <Stack flexDirection={{ xs: "column" }} gap={1}>
      <Box>
        <CircularProgressWithLabel from={0} to={movie?.progress} />
      </Box>
    </Stack>
  );
}
