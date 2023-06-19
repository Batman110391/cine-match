import React from "react";

function srcset(image, resolution) {
  return {
    src: `http://image.tmdb.org/t/p/${resolution}/${image}`,
  };
}

export default function ImageLazyLoad({
  url,
  w,
  h,
  resolution,
  styles,
  ...rest
}) {
  const [defaultLoadingImage, setDefaultLoadingImage] = React.useState({
    backgroundImage: `url(http://image.tmdb.org/t/p/w92/${url})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    filter: "blur(10px)",
    height: h ? h : "auto",
    width: w ? w : "100%",
  });

  const [opacity, setOpacity] = React.useState(0);

  const handleImageLoad = () => {
    setDefaultLoadingImage({
      backgroundImage: `url(http://image.tmdb.org/t/p/w92/${url})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      opacity: 1,
      height: h ? h : "auto",
      width: w ? w : "100%",
    });

    setOpacity(1);
  };

  return (
    <div style={defaultLoadingImage}>
      <img
        style={{
          opacity: opacity,
          width: w ? w : "100%",
          height: h ? h : "auto",
          objectFit: "cover",
          ...styles,
        }}
        {...srcset(url, resolution)}
        alt={`image-${url}`}
        onLoad={handleImageLoad}
        loading="lazy"
        {...rest}
      />
    </div>
  );
}
