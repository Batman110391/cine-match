import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CarouselDiscover from "./CarouselDiscover";

export default function ListNewsMovie({
  news,
  isDesktop,
  openDialogNewsDetail,
}) {
  const handleClickItem = (newsID) => {
    openDialogNewsDetail(newsID);
  };

  return (
    <CarouselDiscover
      slides={news}
      isDesktop={isDesktop}
      handleClickItem={handleClickItem}
      nobg={true}
      customStyle={{
        width: isDesktop ? 300 : 220,
        height: isDesktop ? 300 : 220,
      }}
      Component={CardNews}
    />
  );
}

const CardNews = React.memo(function CardNews({ slideContent, isDesktop }) {
  const { bgImage, articleID, articleTitle, articleDescription } = slideContent;

  const styleTypography = {
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: isDesktop ? 3 : 2,
  };

  return (
    <Card sx={{ width: isDesktop ? 300 : 220, height: isDesktop ? 300 : 220 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height={isDesktop ? "140" : "100"}
          image={bgImage}
          alt={articleID}
        />
        <CardContent sx={{ p: 1, height: isDesktop ? "160px" : "120px" }}>
          <Typography
            gutterBottom
            variant="h6"
            fontSize={"1rem"}
            component="div"
            sx={styleTypography}
          >
            {articleTitle}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ...styleTypography, WebkitLineClamp: 2 }}
          >
            {articleDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});
