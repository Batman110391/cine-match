import { Button, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React from "react";
import { useQuery } from "react-query";
import { fetchProviders } from "../api/tmdbApis";
import LoadingPage from "./LoadingPage";

export default function ListProviderSettng({
  selectedItemsProviders = [],
  setSelectedItemsProviders,
}) {
  const { isLoading, error, data } = useQuery(["providers"], () =>
    fetchProviders()
  );

  if (isLoading) return <LoadingPage />;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  const handleSelectedProviders = (id) => {
    const currSelection = data.filter((item) => item.provider_id === id);
    setSelectedItemsProviders([...selectedItemsProviders, ...currSelection]);
  };

  const handleDeleteProviders = (id) => {
    const newSelectedItems = selectedItemsProviders.filter(
      (sItem) => sItem.provider_id !== id
    );

    setSelectedItemsProviders(newSelectedItems);
  };

  const handleToggleSelectedProviders = (id) => {
    const exist = selectedItemsProviders.find((s) => s.provider_id === id);

    if (exist) {
      handleDeleteProviders(id);
    } else {
      handleSelectedProviders(id);
    }
  };

  const visibleData = data;

  return (
    <Grid
      container
      spacing={0.5}
      sx={{ height: { xs: "265px", lg: "100%" }, overflow: "auto" }}
    >
      {visibleData?.map((provider) => {
        const selected = selectedItemsProviders?.find(
          (s) => s.provider_id === provider.provider_id
        );

        return (
          <Grid item xs="auto" key={provider.provider_id}>
            <Button
              onClick={() =>
                handleToggleSelectedProviders(provider.provider_id)
              }
              color="inherit"
              sx={{
                position: "relative",
                borderRadius: "15px",
                backgroundImage: selected
                  ? `linear-gradient(-180deg, rgba(206, 147, 216, 0.6), rgba(206, 147, 216, 0.6)), url(http://image.tmdb.org/t/p/w500${provider.logo_path})`
                  : `linear-gradient(-180deg, rgba(34,34,34,0.8), rgba(32,32,32,0.8)), url(http://image.tmdb.org/t/p/w500${provider.logo_path})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                objectFit: "cover",
                minWidth: { xs: "60px", sm: "default" },
                height: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
