import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function ListNewsMovie({ news }) {
  console.log("news", news);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2 }}>
      {news.map(({ bgImage, articleID, articleDescription, articleTitle }) => (
        <Card sx={{ display: "flex" }}>
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            image={bgImage}
            alt={articleID}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {articleTitle}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                {articleDescription}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Box>
  );
}
