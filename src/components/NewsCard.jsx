import { useTheme } from "@emotion/react";
import {
  Box,
  Card,
  Grid,
  ListItemButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import moment from "moment";

export function manageImageSizeAndQuality(url, px, quality) {
  const newDimensions = px ? px : "250x180";
  const newQuality = quality ? quality : "100";

  const updatedDimensionUrlString = url
    ? url.replace(/\d+x\d+/, newDimensions)
    : null;

  const updatedQualityUrlString =
    quality && updatedDimensionUrlString
      ? updatedDimensionUrlString.replace(
          "_crop_q85.jpg",
          `_crop_q${newQuality}.jpg`
        )
      : updatedDimensionUrlString;

  return updatedQualityUrlString;
}

function NewsCardImage({ bg, title, w, h, onClick, sx }) {
  const newImage = manageImageSizeAndQuality(bg, "250x180", "100");

  return (
    <Card
      onClick={onClick}
      elevation={3}
      sx={{
        position: "relative",
        backgroundImage: `url(${newImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        height: h ? `${h}px` : "200px",
        width: w ? `${w}px` : "133px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ffffff70",
        transition: "all 0.3s ease-out",
        cursor: onClick ? "pointer" : "inherit",
        ...sx,
      }}
    >
      {!bg && (
        <Typography
          sx={{
            mb: 1,
            textAlign: "center",
            userSelect: "none",
            textShadow: `-1px -1px 1px #1111116b,
                  2px 2px 1px #36363691`,
          }}
          variant="button"
          fontWeight="bold"
          fontSize="0.7rem"
        >
          {title}
        </Typography>
      )}
    </Card>
  );
}

export default function NewsCard({ news, w = 175, h = 275, onClick }) {
  const theme = useTheme();

  return (
    <Grid
      container
      maxWidth={"md"}
      rowSpacing={1}
      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      sx={{ margin: "auto!important" }}
    >
      <Grid item xs={12}>
        <Grid
          component={ListItemButton}
          container
          rowSpacing={1}
          alignItems={"flex-start"}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          onClick={onClick}
        >
          <Grid item xs={12} sm={4} md={4}>
            <Box sx={{ flex: 2 }}>
              <Stack flexDirection={"row"} gap={2}>
                <NewsCardImage
                  bg={news?.bgImage}
                  title={news?.articleTitle}
                  w={w}
                  h={h}
                />
                {!useMediaQuery(theme.breakpoints.up("sm")) && (
                  <Stack sx={{ flex: 1 }} gap={1}>
                    <Typography sx={{ fontSize: "1rem" }} variant={"h6"}>
                      {news?.articleTitle}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ fontSize: "0.7rem" }}
                      variant={"button"}
                      color={"text.secondary"}
                    >
                      {moment(
                        new Date(news?.articleDataFromatting).getTime()
                      ).fromNow()}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={8}>
            <Stack>
              {useMediaQuery(theme.breakpoints.up("sm")) && (
                <>
                  <Typography sx={{ fontSize: "1rem" }} variant={"h6"}>
                    {news?.articleTitle}
                  </Typography>
                  <Typography
                    component="span"
                    sx={{ fontSize: "0.7rem" }}
                    variant={"button"}
                    color={"text.secondary"}
                  >
                    {moment(
                      new Date(news?.articleDataFromatting).getTime()
                    ).fromNow()}
                  </Typography>
                </>
              )}
              <Typography
                component="span"
                fontWeight={300}
                sx={{
                  mt: 1,
                  fontSize: "0.8rem",
                }}
                variant={"body2"}
              >
                {news?.articleDescription}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
