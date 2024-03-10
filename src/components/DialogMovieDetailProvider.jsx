import React from "react";
import DialogMovieDetail from "./DialogMovieDetail";
import DialogPersonDetail from "./DialogPersonDetail";
import DialogNewsDetail from "./DialogNewsDetail";
import DialogEpisodeDetail from "./DialogEpisodeDetail";

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

  const [openPersonDialogSub, setOpenPersonDialogSub] = React.useState(false);
  const [personIDSub, setPersonIDSub] = React.useState(null);

  const [openNewsDialog, setOpenNewsDialog] = React.useState(false);
  const [newsID, setNewsID] = React.useState(null);

  const [openEpisodeDialog, setOpenEpisodeDialog] = React.useState(false);
  const [episodeNumber, setEpisodeNumber] = React.useState(null);
  const [seriesID, setSeriesID] = React.useState(null);
  const [seasonNumber, setSeasonNumber] = React.useState(null);

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
      openDialogNewsDetail(newsID) {
        setOpenNewsDialog(true);
        setNewsID(newsID);
      },
      openDialogEpisodeDetail(seriesID, seasonNumber, episodeNumber) {
        setOpenEpisodeDialog(true);
        setSeriesID(seriesID);
        setSeasonNumber(seasonNumber);
        setEpisodeNumber(episodeNumber);
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

  function handleClosePersonDialogSub() {
    setOpenPersonDialogSub(false);
    setPersonIDSub(null);
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

  const handleClickPersonSub = (personID) => {
    setOpenPersonDialogSub(true);
    setPersonIDSub(personID);
  };

  const handleClickNews = (newsID) => {
    setOpenNewsDialog(true);
    setNewsID(newsID);
  };

  const handleCloseDialog = () => {
    setOpenNewsDialog(false);
    setNewsID(null);
  };

  const handleClickEpisode = (seriesID, seasonNumber, episodeNumber) => {
    setOpenEpisodeDialog(true);
    setSeriesID(seriesID);
    setSeasonNumber(seasonNumber);
    setEpisodeNumber(episodeNumber);
  };

  const handleCloseEpisodeDialog = () => {
    setOpenEpisodeDialog(false);
    setSeriesID(null);
    setEpisodeNumber(null);
    setSeasonNumber(null);
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
          openDialogNewsDetail={handleClickNews}
          openDialogEpisodeDetail={handleClickEpisode}
        />
      )}
      {movieIDSubDialog && typeSubDialog && (
        <DialogMovieDetail
          open={openSubDialog}
          handleClose={handleCloseSubDialog}
          movieID={movieIDSubDialog}
          type={typeSubDialog}
          subItemClick={handleClickSubItem}
          openPersonDialog={
            openSubDialog ? handleClickPersonSub : handleClickPerson
          }
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
      {personIDSub && (
        <DialogPersonDetail
          open={openPersonDialogSub}
          handleClose={handleClosePersonDialogSub}
          personID={personIDSub}
          subItemClick={handleClickSubItem}
        />
      )}

      {newsID && (
        <DialogNewsDetail
          open={openNewsDialog}
          onClose={handleCloseDialog}
          newsID={newsID}
        />
      )}

      {seriesID && seasonNumber && episodeNumber && (
        <DialogEpisodeDetail
          open={openEpisodeDialog}
          handleClose={handleCloseEpisodeDialog}
          seriesID={seriesID}
          seasonNumber={seasonNumber}
          episodeNumber={episodeNumber}
          openPersonDialog={handleClickPerson}
        />
      )}
    </React.Fragment>
  );
}
