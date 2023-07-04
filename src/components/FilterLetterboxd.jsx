import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { genresList } from "../api/tmdbApis";
import { Button, ButtonBase, Typography } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function FilterLetterboxd({ onApplyFilter, loading }) {
  const [valueYear, setValueYear] = React.useState([
    1900,
    new Date().getFullYear(),
  ]);
  const [genreName, setgenreName] = React.useState([]);

  const [disableAction, setDisableAction] = React.useState(true);

  const handleChangeDisableAction = () => {
    setDisableAction(false);
  };

  const handleApplyFilter = () => {
    const genresIds = genreName.map((genre) => {
      return genresList.find(({ name }) => name === genre).id;
    });

    onApplyFilter(valueYear, genresIds);
    setDisableAction(true);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <MultipleSelectCheckmarks
          genreName={genreName}
          setgenreName={setgenreName}
          handleChangeDisableAction={handleChangeDisableAction}
          loading={loading}
        />
        <RangeSlider
          valueYear={valueYear}
          setValueYear={setValueYear}
          handleChangeDisableAction={handleChangeDisableAction}
          loading={loading}
        />
        <Box sx={{ width: "200px", display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleApplyFilter}
            disabled={disableAction}
            variant="contained"
          >
            Applica
          </Button>
        </Box>
      </Box>
    </>
  );
}

function MultipleSelectCheckmarks({
  genreName,
  setgenreName,
  handleChangeDisableAction,
  loading,
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setgenreName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
    handleChangeDisableAction();
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="genre-letterboxd-label">Genere</InputLabel>
        <Select
          labelId="genre-letterboxd-label"
          id="genre-letterboxd"
          disabled={loading}
          multiple
          value={genreName}
          onChange={handleChange}
          input={<OutlinedInput label="Genere" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {genresList.map(({ name, id }) => (
            <MenuItem key={id} value={name}>
              <Checkbox checked={genreName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function RangeSlider({
  valueYear,
  setValueYear,
  handleChangeDisableAction,
  loading,
}) {
  const handleChange = (event, newValue) => {
    setValueYear(newValue);
    handleChangeDisableAction();
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography gutterBottom>
        Anno di rilascio: {valueYear.join(" - ")}
      </Typography>
      <Slider
        disabled={loading}
        getAriaLabel={() => "Year range"}
        value={valueYear}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={(valuetext) => valuetext}
        step={1}
        min={1900}
        max={new Date().getFullYear()}
      />
    </Box>
  );
}
