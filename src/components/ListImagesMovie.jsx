import { useTheme } from "@emotion/react";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { Skeleton, useMediaQuery } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import * as React from "react";

function srcset(image) {
  return {
    src: `http://image.tmdb.org/t/p/original${image}`,
  };
}

export default function ListImagesMovie({ images }) {
  const theme = useTheme();

  const itemData = images?.filter((ele) => !ele?.iso_639_1);

  const [loadedImages, setLoadedImages] = React.useState([]);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleImageLoad = (index) => {
    setLoadedImages((prevLoadedImages) => [...prevLoadedImages, index]);
  };

  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = srcset(itemData[selectedImage]?.file_path).src;
    downloadLink.download = `image-${itemData[selectedImage]?.file_path}`;
    downloadLink.target = "_blank";
    downloadLink.click();
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <ImageList
        variant="quilted"
        sx={{
          width: "100%",
          height: 450,
          transform: "translateZ(0)",
        }}
        rowHeight={200}
        cols={useMediaQuery(theme.breakpoints.up("sm")) ? 4 : 1}
        gap={4}
      >
        {itemData.map((item, i) => {
          const featured = i === 0 || i % 3 === 0;
          const cols = featured ? 2 : 1;
          const rows = featured ? 2 : 1;

          const isLoaded = loadedImages.includes(i);

          return (
            <ImageListItem key={item.file_path} cols={cols} rows={rows}>
              {!isLoaded && ( // Mostra lo skeleton di caricamento solo se l'immagine non è ancora stata caricata
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
              <img
                style={{
                  borderRadius: "10px",
                  display: isLoaded ? "block" : "none",
                }}
                {...srcset(item.file_path)}
                alt={`image-${item.file_path}`}
                onLoad={() => handleImageLoad(i)}
                onClick={() => setSelectedImage(i)}
              />
            </ImageListItem>
          );
        })}
      </ImageList>
      <Dialog open={selectedImage !== null} onClose={handleClose}>
        <IconButton
          sx={{
            position: "absolute",
            top: theme.spacing(1),
            right: theme.spacing(1),
            zIndex: 1,
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>

        {useMediaQuery(theme.breakpoints.up("sm")) && (
          <IconButton
            sx={{
              position: "absolute",
              top: theme.spacing(1),
              left: theme.spacing(1),
              zIndex: 1,
            }}
            onClick={handleDownload}
          >
            <ZoomInIcon />
          </IconButton>
        )}
        <DialogContent sx={{ padding: 0 }}>
          <img
            style={{
              borderRadius: "10px",
              display: "block",
              margin: "0 auto",
              maxWidth: "100%",
            }}
            {...srcset(itemData[selectedImage]?.file_path)}
            alt={`image-${itemData[selectedImage]?.file_path}`}
            onLoad={() => handleImageLoad(selectedImage)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
