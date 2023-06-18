import { Popper } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { useQuery } from "react-query";
import { fetchCounties } from "../api/tmdbApis";

const CustomPopper = ({ ...props }) => <Popper {...props} />;

export default function CountrySelect({ languageMovie, setLanguageMovie }) {
  const autocompleteRef = React.useRef(null);
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
      ref={autocompleteRef}
      sx={{ width: 300 }}
      PopperComponent={(popperProps) => <CustomPopper {...popperProps} />}
      filterOptions={(options, { inputValue }) =>
        options
          .filter(
            (option) =>
              option?.native_name
                .toLowerCase()
                .indexOf(inputValue.toLowerCase()) !== -1
          )
          .slice(0, 4)
      }
      loading={isLoading}
      options={data || []}
      autoHighlight
      value={currentValue}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
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
