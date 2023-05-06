import { Button, DialogActions } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import * as React from "react";
import { DATA_TOMORROW, DATE_SIX_MONTHS_LATER } from "../api/tmdbApis";

export default function MobileDataPicker({ props }) {
  const {
    initialDate,
    setInitialDate,
    lastDate,
    setLastDate,
    setErrorInitialDate,
    setErrorLastDate,
  } = props;

  const CustomActionBar = ({ onAccept, onCancel }) => {
    return (
      <DialogActions>
        <Button onClick={onAccept}> Ok </Button>
        <Button onClick={onCancel}> Cancella </Button>
      </DialogActions>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        gap={2}
        sx={{
          justifyContent: { xs: "space-between", sm: "space-around" },
        }}
      >
        <MobileDatePicker
          label="Data Iniziale"
          openTo="year"
          views={["year"]}
          value={initialDate}
          onChange={(newValue) => {
            setInitialDate(newValue);
          }}
          onError={(error) => {
            if (error !== null) {
              console.error(error);
              setErrorInitialDate(true);
            } else {
              setErrorInitialDate(false);
            }
          }}
          components={{
            ActionBar: CustomActionBar,
          }}
          maxDate={DATA_TOMORROW}
          inputFormat="YYYY"
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{ ...params.inputProps, mask: "____" }}
            />
          )}
        />
        -
        <MobileDatePicker
          label="Data finale"
          openTo="year"
          views={["year"]}
          value={lastDate}
          onChange={(newValue) => {
            setLastDate(newValue);
          }}
          onError={(error) => {
            if (error !== null) {
              console.error(error);
              setErrorLastDate(true);
            } else {
              setErrorLastDate(false);
            }
          }}
          components={{
            ActionBar: CustomActionBar,
          }}
          maxDate={DATE_SIX_MONTHS_LATER}
          inputFormat="YYYY"
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{ ...params.inputProps, mask: "____" }}
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}
