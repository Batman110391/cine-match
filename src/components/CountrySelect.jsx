import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { fetchCounties } from "../api/tmdbApis";
import { useQuery } from "react-query";

export default function CountrySelect({ languageMovie, setLanguageMovie }) {
  const [inputValue, setInputValue] = React.useState("");

  const { isLoading, error, data } = useQuery(["countries"], () =>
    fetchCounties()
  );

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const currentValue = data?.find(
    (ele) => ele?.iso_3166_1?.toLowerCase() === languageMovie
  );

  return (
    <Autocomplete
      sx={{ width: 300 }}
      loading={isLoading}
      options={data || []}
      autoHighlight
      value={currentValue}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        console.log("newValue", newValue);
        setLanguageMovie(newValue?.iso_3166_1?.toLowerCase());
      }}
      getOptionLabel={(option) => option?.native_name}
      renderOption={(props, option) => (
        <Box
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          {...props}
        >
          <img
            loading="lazy"
            width="20"
            src={`https://flagcdn.com/w20/${option.iso_3166_1.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.iso_3166_1.toLowerCase()}.png 2x`}
            alt=""
          />
          {option.native_name} ({option.iso_3166_1})
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Scegli un paese"
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
