import { Avatar, Chip } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { animate } from "framer-motion";
import * as React from "react";
import { useSelector } from "react-redux";
import TypographyAnimated from "./TypographyAnimated";

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
        size={100}
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
        size={100}
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

function ChipGroup({ groups }) {
  return (
    <Stack direction="row" flexWrap={"wrap"} gap={1}>
      {groups &&
        groups.length > 0 &&
        groups.map((item) => {
          const existPath = item?.profile_path ? (
            <Avatar
              alt={item.name}
              src={`http://image.tmdb.org/t/p/w500${item.profile_path}`}
            />
          ) : (
            <Avatar>{item.name.charAt(0)}</Avatar>
          );

          return <Chip key={item.id} avatar={existPath} label={item.name} />;
        })}
    </Stack>
  );
}

export default function ChartCompatibility({ movie }) {
  const prevIdGenred = [];
  const prevIdCast = [];

  const genres = useSelector((state) => state.movieQuery.genres);
  const cast = useSelector((state) => state.movieQuery.cast);

  const onlyIdCast = cast.map((c) => c.id);

  const currentCast = movie?.credits?.cast;
  const currentCrew = movie?.credits?.crew;

  currentCast.forEach((item) => {
    if (onlyIdCast.includes(item.id) && !prevIdCast.includes(item.id)) {
      prevIdCast.push(item.id);
    }
  });
  currentCrew.forEach((item) => {
    if (
      onlyIdCast.includes(item.id) &&
      !prevIdCast.includes(item.id) &&
      item.department === "Directing"
    ) {
      prevIdCast.push(item.id);
    }
  });

  return (
    <Stack flexDirection={{ xs: "column", sm: "row" }} gap={4}>
      <Box>
        <TypographyAnimated
          component={"div"}
          sx={{ mb: 2 }}
          variant={"body2"}
          text={`Compatibilità`}
        />
        <CircularProgressWithLabel from={0} to={movie?.progress} />
      </Box>
      <Box>
        <Stack gap={1}>
          {prevIdGenred.length > 0 && (
            <>
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                text={`Generi presenti nella ricerca`}
              />
              <ChipGroup
                groups={genres.filter((g) => prevIdGenred.includes(g.id))}
              />
            </>
          )}
          {prevIdCast.length > 0 && (
            <>
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                text={`Cast presente nella ricerca`}
              />
              <ChipGroup
                groups={cast.filter((c) => prevIdCast.includes(c.id))}
              />
            </>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
