import { useTheme } from "@emotion/react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Divider,
  ListItemButton,
  ListSubheader,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { motion } from "framer-motion";
import * as React from "react";
import { MAX_CAST_VISUALIZATION } from "../utils/constant";
import SubHeader from "./SubHeader";

export default function CastListDetail({
  person,
  height,
  openDialogPersonDetail,
}) {
  const theme = useTheme();

  const [maxPersonRow, setMaxPersonRow] = React.useState(
    MAX_CAST_VISUALIZATION
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const filterPersonForMobile = isDesktop
    ? person
    : person.slice(0, maxPersonRow);

  const handleClickViewAll = () => {
    setMaxPersonRow(person.length - 1);
  };

  const handleClickViewMaxRow = () => {
    setMaxPersonRow(MAX_CAST_VISUALIZATION);
  };

  const handleClickItem = (personID) => {
    openDialogPersonDetail(personID);
  };

  const actionsComponents =
    maxPersonRow > MAX_CAST_VISUALIZATION
      ? [
          {
            icon: <VisibilityOffIcon fontSize="small" />,
            props: { onClick: handleClickViewMaxRow },
          },
        ]
      : [];

  return (
    <List
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        width: "100%",
        maxHeight: { xs: "inherit", sm: height ? `${height}px` : "50vh" },
        overflowY: { xs: "inherit", sm: "auto" },
      }}
      subheader={
        isDesktop ? (
          <ListSubheader
            sx={{
              bgcolor: (theme) => theme.palette.background.paper,
              borderRadius: (theme) => theme.spacing(0.5),
            }}
          >
            <Typography sx={{ fontSize: "0.6rem" }} variant={"button"}>
              {"Cast"}
            </Typography>
          </ListSubheader>
        ) : (
          <SubHeader title={"Cast"} actions={actionsComponents} />
        )
      }
    >
      {filterPersonForMobile.map(
        ({ profile_path, name, id, known_for_department, character }, i) => {
          const labelId = `checkbox-list-secondary-label-${id}`;

          return (
            <React.Fragment key={id + name + i}>
              <ListItem disableGutters>
                <ListItemButton
                  disableGutters
                  onClick={() => handleClickItem(id)}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={`Avatar ${name}`}
                      src={`http://image.tmdb.org/t/p/w500${profile_path}`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    disableTypography
                    primary={
                      <Typography variant="subtitle2">{name}</Typography>
                    }
                    secondary={
                      <Typography variant="caption">{character}</Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {i < person.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          );
        }
      )}
      {!isDesktop &&
        maxPersonRow == MAX_CAST_VISUALIZATION &&
        person.length > MAX_CAST_VISUALIZATION && (
          <Box
            sx={{
              paddingTop: 2,
              gap: 1.5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handleClickViewAll}
          >
            <Typography sx={{ fontSize: "0.6rem" }} variant={"button"}>
              {"Visualizza altro"}
            </Typography>

            <KeyboardDoubleArrowDownIcon fontSize="small" />
          </Box>
        )}
    </List>
  );
}
