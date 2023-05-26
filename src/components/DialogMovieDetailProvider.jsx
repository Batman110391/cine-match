import React from "react";
import DialogMovieDetail from "./DialogMovieDetail";
import DialogPersonDetail from "./DialogPersonDetail";

export const DialogMovieDetailContext = React.createContext({});

export default function DialogMovieDetailProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [movieID, setMovieID] = React.useState(null);
  const [type, setType] = React.useState(null);

  const [openSubDialog, setOpenSubDialog] = React.useState(false);
  const [movieIDSubDialog, setMovieIDSubDialog] = React.useState(null);
  const [typeSubDialog, setTypeSubDialog] = React.useState(null);

  const [openPersonDialog, setOpenPersonDialog] = React.useState(false);
  const [personID, setPersonID] = React.useState(null);

  const contextValue = React.useMemo(
    () => ({
      openDialogMovieDetail(movieID, type) {
        setOpen(true);
        setMovieID(movieID);
        setType(type);
      },
      openDialogPersonDetail(personID) {
        setOpenPersonDialog(true);
        setPersonID(personID);
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

  function handleClosePersonDialog() {
    setOpenPersonDialog(false);
    setPersonID(null);
  }

  const handleClickSubItem = (movieID, type) => {
    setOpenSubDialog(true);
    setMovieIDSubDialog(movieID);
    setTypeSubDialog(type);
  };

  const handleClickPerson = (personID) => {
    setOpenPersonDialog(true);
    setPersonID(personID);
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
          openPersonDialog={handleClickPerson}
        />
      )}
      {movieIDSubDialog && typeSubDialog && (
        <DialogMovieDetail
          open={openSubDialog}
          handleClose={handleCloseSubDialog}
          movieID={movieIDSubDialog}
          type={typeSubDialog}
          subItemClick={handleClickSubItem}
          openPersonDialog={handleClickPerson}
        />
      )}
      {personID && (
        <DialogPersonDetail
          open={openPersonDialog}
          handleClose={handleClosePersonDialog}
          personID={personID}
          subItemClick={handleClickSubItem}
        />
      )}
    </React.Fragment>
  );
}
