import { Avatar, Chip, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/system";
import { animate } from "framer-motion";
import * as React from "react";
import { useSelector } from "react-redux";
import TypographyAnimated from "./TypographyAnimated";
import { useTheme } from "@emotion/react";

function getStyleChart(variant, numb) {
  const theme = useTheme();

  const currentReactionColor =
    numb > 70
      ? theme.palette.chartPrimary.positive
      : numb < 50
      ? theme.palette.chartPrimary.negative
      : theme.palette.chartPrimary.middle;

  switch (variant) {
    case "dark":
      return {
        bgChart: alpha(theme.palette.background.dark, 0.3),
        colorOutline: "transparent",
        colorInline: currentReactionColor,
      };

    case "light":
      return {
        bgChart: alpha(theme.palette.background.dark, 0.3),
        colorOutline: "transparent",
        colorInline: currentReactionColor,
      };

    default:
      return {
        bgChart: alpha(theme.palette.background.dark, 0.3),
        colorOutline: "transparent",
        colorInline: currentReactionColor,
      };
  }
}

export function CircularProgressWithLabel({
  from = 0,
  to,
  size = 100,
  thickness = 3,
  labelSize = 15,
  durationAnimate = 2,
  variant = "default",
}) {
  const [progress, setProgress] = React.useState(0);
  const nodeRef = React.useRef();

  const { colorOutline, colorInline, bgChart } = getStyleChart(variant, to);

  React.useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: durationAnimate,
      onUpdate(value) {
        node.textContent = `${Math.round(value)}`;
        setProgress(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        background: bgChart,
        borderRadius: "50%",
      }}
    >
      <CircularProgress
        value={100}
        variant="determinate"
        sx={{
          color: colorOutline,
        }}
        size={size}
        thickness={thickness}
      />
      <CircularProgress
        value={progress || 0}
        variant="determinate"
        sx={{
          color: colorInline,
          //animationDuration: "550ms",
          position: "absolute",
          left: 0,
        }}
        size={size}
        thickness={thickness}
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
          color="text.primary"
          fontWeight={"bold"}
          fontSize={`${labelSize}px`}
        />
        <Typography
          variant="caption"
          fontSize={7}
          sx={{ alignSelf: "self-start", mt: 1.3 }}
        >
          {"%"}
        </Typography>
      </Box>
    </Box>
  );
}

function ChipGroup({ groups, ...rest }) {
  return (
    <Stack direction="row" flexWrap={"wrap"} gap={1}>
      {groups &&
        groups.length > 0 &&
        groups.map((item) => {
          const existPath = item?.profile_path ? (
            <Avatar
              alt={item.name}
              src={`http://image.tmdb.org/t/p/w342${item.profile_path}`}
            />
          ) : (
            <Avatar>{item.name.charAt(0)}</Avatar>
          );

          return (
            <Chip
              key={item.id}
              avatar={existPath}
              label={item.name}
              {...rest}
            />
          );
        })}
    </Stack>
  );
}

export default function ChartCompatibility({ movie, cast, genres }) {
  let progress = 0;
  const prevIdGenred = [];
  const prevIdCast = [];

  const onlyIdGenres = genres.map((g) => g.id);
  const onlyIdCast = cast.map((c) => c.id);

  const currentGeneresMovie = movie.genre_ids;
  const currentCast = movie?.credits?.cast;
  const currentCrew = movie?.credits?.crew;

  const divideProgress = 100 / (genres.length + cast.length);

  currentGeneresMovie.forEach((item) => {
    if (onlyIdGenres.includes(item) && !prevIdGenred.includes(item)) {
      progress += divideProgress;
      prevIdGenred.push(item);
    }
  });

  currentCast.forEach((item) => {
    if (onlyIdCast.includes(item.id) && !prevIdCast.includes(item.id)) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });
  currentCrew.forEach((item) => {
    if (
      onlyIdCast.includes(item.id) &&
      !prevIdCast.includes(item.id) &&
      item.department === "Directing"
    ) {
      progress += divideProgress;
      prevIdCast.push(item.id);
    }
  });

  return (
    <Stack flexDirection={{ xs: "column", sm: "row" }} gap={4}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            width: "fit-content",
          }}
        >
          <TypographyAnimated
            component={"div"}
            sx={{ fontSize: "0.6rem" }}
            variant={"button"}
            text={`Compatibilità`}
            gutterBottom
          />
          <CircularProgressWithLabel from={0} to={progress} />
        </Box>
      </Box>
      <Box>
        <Stack gap={1}>
          {prevIdGenred.length > 0 && (
            <>
              <TypographyAnimated
                component={"div"}
                sx={{ fontSize: "0.6rem" }}
                variant={"button"}
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
                sx={{ fontSize: "0.6rem" }}
                variant={"button"}
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
