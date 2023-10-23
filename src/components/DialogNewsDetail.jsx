import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  DialogContent,
  LinearProgress,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import { fetchDetailNewsById } from "../api/tmdbApis";
import DialogWrapperResponsivness from "./DialogWrapperResponsivness";
import SpeedDialShare from "./SpeedDialShare";
import { manageImageSizeAndQuality } from "./NewsCard";
import ImageLazyLoad from "./ImageLazyLoad";
import { red } from "@mui/material/colors";

export default function DialogNewsDetail({ open, onClose, newsID }) {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(["detailNews", newsID], () =>
    fetchDetailNewsById(newsID)
  );

  const detail = data;

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <DialogWrapperResponsivness
      open={open}
      onClose={onClose}
      isDesktop={isDesktop}
      maxWidth={"md"}
      PaperProps={{
        sx: {
          height: "100%",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ position: "relative" }}>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <SpeedDialShare
            movieID={detail?.ID}
            type={"news"}
            title={detail?.articleTitle}
          />
        </Toolbar>
      </AppBar>

      {isLoading && !error ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <h1>{JSON.stringify(error)}</h1>
      ) : (
        <DialogContent
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{
            paddingX: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" letterSpacing={1.2}>
            {detail?.articleTitle}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="caption">{detail?.articleDate}</Typography>
            <Typography variant="caption">
              {detail?.articleType === "review"
                ? "Recensione"
                : "Approfondimento"}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            fontWeight={300}
            fontSize={"1.15rem"}
            fontStyle={"italic"}
          >
            {detail?.articleDescription}
          </Typography>
          {detail?.articleReview?.map(
            ({ subtitle, textBlocks, blockImage }, i) => {
              const renderImage = blockImage ? (
                <ImageLazyLoad
                  defaultDomain={blockImage}
                  resolution={manageImageSizeAndQuality}
                  px={"960x0"}
                  quality={"150"}
                />
              ) : null;

              return (
                <Box key={i + "textBlock"}>
                  {renderImage && (
                    <Box sx={{ textAlign: "center", my: 1 }}>{renderImage}</Box>
                  )}

                  {subtitle && (
                    <Typography
                      sx={{
                        py: 2,
                        textDecoration: "underline",
                        textDecorationColor: red[400],
                      }}
                      variant="h5"
                      letterSpacing={1.2}
                    >
                      {subtitle}
                    </Typography>
                  )}
                  {textBlocks?.map((text, i) => (
                    <Typography
                      key={i + "subTextBlock"}
                      sx={{ py: 1 }}
                      fontWeight={300}
                      fontFamily={"system-ui"}
                      letterSpacing={1}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  ))}
                </Box>
              );
            }
          )}
        </DialogContent>
      )}
    </DialogWrapperResponsivness>
  );
}
