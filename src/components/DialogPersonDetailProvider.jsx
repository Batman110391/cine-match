import React from "react";
import DialogPersonDetail from "./DialogPersonDetail";

export const DialogPersonDetailContext = React.createContext({});

export default function DialogPersonDetailProvider({ children }) {
  const [open, setOpen] = React.useState(false);
  const [personID, setPersonID] = React.useState(null);

  const contextValue = React.useMemo(
    () => ({
      openDialogPersonDetail(personID) {
        setOpen(true);
        setPersonID(personID);
      },
    }),
    []
  );

  function handleClose() {
    setOpen(false);
    setPersonID(null);
  }

  return (
    <React.Fragment>
      <DialogPersonDetailContext.Provider value={contextValue}>
        {children}
      </DialogPersonDetailContext.Provider>
      {personID && (
        <DialogPersonDetail
          open={open}
          handleClose={handleClose}
          personID={personID}
        />
      )}
    </React.Fragment>
  );
}
