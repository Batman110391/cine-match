import { useTheme } from "@emotion/react";
import {
  Divider,
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

export default function CastListDetail({ person, height }) {
  const theme = useTheme();

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
        useMediaQuery(theme.breakpoints.up("sm")) ? (
          <ListSubheader>Cast</ListSubheader>
        ) : (
          <Typography>Cast</Typography>
        )
      }
    >
      {person.map(
        ({ profile_path, name, id, known_for_department, character }, i) => {
          const labelId = `checkbox-list-secondary-label-${id}`;

          return (
            <React.Fragment key={id + name + i}>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar ${name}`}
                    src={`http://image.tmdb.org/t/p/w500${profile_path}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  id={labelId}
                  disableTypography
                  primary={<Typography variant="subtitle2">{name}</Typography>}
                  secondary={
                    <Typography variant="caption">{character}</Typography>
                  }
                />
              </ListItem>
              {i <= person.length - 2 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          );
        }
      )}
    </List>
  );
}
