import React from "react";
import DialogMovieDetail from "./DialogMovieDetail";

export const DialogMovieDetailContext = React.createContext({});

export default function DialogMovieDetailProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [movieID, setMovieID] = React.useState(null);
  const [type, setType] = React.useState(null);

  const [openSubDialog, setOpenSubDialog] = React.useState(false);
  const [movieIDSubDialog, setMovieIDSubDialog] = React.useState(null);
  const [typeSubDialog, setTypeSubDialog] = React.useState(null);

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

  function handleCloseSubDialog() {
    setOpenSubDialog(false);
    setMovieIDSubDialog(null);
    setTypeSubDialog(null);
  }

  const handleClickSubItem = (movieID, type) => {
    setOpenSubDialog(true);
    setMovieIDSubDialog(movieID);
    setTypeSubDialog(type);
  };

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
          subItemClick={handleClickSubItem}
        />
      )}
      {movieIDSubDialog && typeSubDialog && (
        <DialogMovieDetail
          open={openSubDialog}
          handleClose={handleCloseSubDialog}
          movieID={movieIDSubDialog}
          type={typeSubDialog}
          subItemClick={handleClickSubItem}
        />
      )}
    </React.Fragment>
  );
}
