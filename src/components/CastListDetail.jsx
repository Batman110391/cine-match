import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Divider, IconButton, ListSubheader, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setQuery } from "../store/movieQuery";
import { useQuery } from "react-query";
import { fetchMoviesByCasts } from "../api/tmdbApis";

export default function CastListDetail({
  person,
  height,
  handleAddMoviesByInsertPeople,
  handleRemoveMoviesByInsertPeople,
}) {
  const visible = { opacity: 1, y: 0, transition: { duration: 0.5 } };
  const cast = useSelector((state) => state.movieQuery.cast);
  const dispatch = useDispatch();

  const [selected, setSelected] = React.useState(null);

  useQuery(["addMoreOptions", selected], async () => {
    const data = await fetchMoviesByCasts(selected);

    if (data) {
      handleAddMoviesByInsertPeople(data.results);
    }
  });

  const handleAddPerson = (value) => {
    //TODO
    setSelected(value);
    dispatch(setQuery({ cast: [...cast, value] }));
  };
  const handleRemovePerson = (value) => {
    //TODO
    const newCast = cast.filter((c) => c.id !== value.id);

    setSelected(null);
    handleRemoveMoviesByInsertPeople(value.id);
    dispatch(setQuery({ cast: newCast }));
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
