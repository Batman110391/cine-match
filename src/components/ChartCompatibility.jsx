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
    <Stack direction="row" spacing={1}>
      {groups &&
        groups.length > 0 &&
        groups
          .filter((_, index) => index <= 5)
          .map((item) => {
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
      {groups.length > 5 && <Chip label={`+${groups.length - 5}`} />}
    </Stack>
  );
}

export default function ChartCompatibility({ movie }) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };

  let progress = 0;
  const prevIdGenred = [];
  const prevIdCast = [];

  const genres = useSelector((state) => state.movieQuery.genres);
  const cast = useSelector((state) => state.movieQuery.cast);

  const onlyIdGenres = genres.map((g) => g.id);
  const onlyIdCast = cast.map((c) => c.id);

  const currentGeneresMovie = movie.genres;
  const currentCast = movie.credits.cast;
  const currentCrew = movie.credits.crew;

  const divideProgress = 100 / (genres.length + cast.length);

  currentGeneresMovie.forEach((item) => {
    if (onlyIdGenres.includes(item.id) && !prevIdGenred.includes(item.id)) {
      progress += divideProgress;
      prevIdGenred.push(item.id);
    }
  });
  currentCast.forEach((item) => {
    if (onlyIdCast.includes(item.id) && !prevIdCast.includes(item.id)) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });
  currentCrew.forEach((item) => {
    if (onlyIdCast.includes(item.id) && !prevIdCast.includes(item.id)) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });

  return (
    <Stack flexDirection={"row"} gap={4}>
      <Box>
        <CircularProgressWithLabel from={0} to={Math.round(progress)} />
      </Box>
      <Box>
        <Stack gap={1}>
          {prevIdGenred.length > 0 && (
            <>
              <TypographyAnimated
                component={"div"}
                variant={"body2"}
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                text={`Generi presenti nella ricerca :`}
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
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible,
                }}
                text={`Cast presente nella ricerca :`}
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
