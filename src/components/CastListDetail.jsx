import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Divider, IconButton, ListSubheader, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { motion } from "framer-motion";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../store/movieQuery";

export default function CastListDetail({
  movieId,
  person,
  height,
  handleAddMoviesByInsertPeople,
  handleRemoveMoviesByInsertPeople,
}) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
  const cast = useSelector((state) => state.movieQuery.cast);
  const dispatch = useDispatch();

  const handleAddPerson = (value) => {
    dispatch(setQuery({ cast: [...cast, value] }));
    handleAddMoviesByInsertPeople(movieId);
  };
  const handleRemovePerson = (value) => {
    const newCast = cast.filter((c) => c.id !== value.id);
    dispatch(setQuery({ cast: newCast }));
    handleRemoveMoviesByInsertPeople(movieId);
  };

  return (
    <List
      component={motion.div}
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible,
      }}
      sx={{
        width: "100%",
        maxHeight: height ? `${height}px` : "50vh",
        overflowY: "auto",
      }}
      subheader={<ListSubheader>Cast</ListSubheader>}
    >
      {person.map(
        ({ profile_path, name, id, known_for_department, character }, i) => {
          const labelId = `checkbox-list-secondary-label-${id}`;

          const existCast = cast.find((c) => c.id === id);

          const actionButton = existCast ? (
            <IconButton onClick={() => handleRemovePerson(person[i])}>
              <RemoveIcon />
            </IconButton>
          ) : (
            <IconButton onClick={() => handleAddPerson(person[i])}>
              <AddIcon />
            </IconButton>
          );

          return (
            <React.Fragment key={id + name + i}>
              <ListItem secondaryAction={actionButton} disableGutters>
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
