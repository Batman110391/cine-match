import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import * as React from "react";

function srcset(image) {
  return {
    src: `http://image.tmdb.org/t/p/original${image}`,
    srcSet: `http://image.tmdb.org/t/p/original${image}`,
  };
}

export default function ListImagesMovie({ images }) {
  const theme = useTheme();

  const itemData = images?.filter((ele) => !ele?.iso_639_1);

  return (
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

        return (
          <ImageListItem key={item.file_path} cols={cols} rows={rows}>
            <img
              style={{ borderRadius: "10px" }}
              {...srcset(item.file_path)}
              alt={item.file_path}
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
}
