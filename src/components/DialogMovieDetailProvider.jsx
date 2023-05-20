import React from "react";
import DialogMovieDetail from "./DialogMovieDetail";

export const DialogMovieDetailContext = React.createContext({});

export default function DialogMovieDetailProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [movieID, setMovieID] = React.useState(null);
  const [type, setType] = React.useState(null);

  const contextValue = React.useMemo(
    () => ({
      openDialogMovieDetail(movieID, type) {
        setOpen(true);
        setMovieID(movieID);
        setType(type);
      },
    }),
    []
  );

  function handleClose() {
    setOpen(false);
    setMovieID(null);
    setType(null);
  }

  return (
    <React.Fragment>
      <DialogMovieDetailContext.Provider value={contextValue}>
        {children}
      </DialogMovieDetailContext.Provider>
      {movieID && type && (
        <DialogMovieDetail
          open={open}
          handleClose={handleClose}
          movieID={movieID}
          type={type}
        />
      )}
    </React.Fragment>
  );
}
