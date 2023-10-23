import React from "react";

function srcset(image, resolution, px, quality) {
  if (typeof resolution === "function") {
    return {
      src: resolution(image, px, quality),
    };
  }

  return {
    src: `http://image.tmdb.org/t/p/${resolution}/${image}`,
  };
}

export default function ImageLazyLoad({
  url = "",
  w,
  h = "300px",
  resolution,
  px,
  quality,
  styles,
  defaultDomain = "http://image.tmdb.org/t/p/w92/",
  ...rest
}) {
  const defaultSrc = defaultDomain + url;

  const [defaultLoadingImage, setDefaultLoadingImage] = React.useState({
    backgroundImage: `url(${defaultSrc})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    filter: "blur(10px)",
    height: h ? h : "auto",
    width: w ? w : "100%",
  });

  const [opacity, setOpacity] = React.useState(0);

  const handleImageLoad = () => {
    setDefaultLoadingImage({
      backgroundImage: `url(${defaultSrc})`,
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
        {...srcset(url || defaultSrc, resolution, px, quality)}
        alt={`image-${url || defaultSrc}`}
        onLoad={handleImageLoad}
        loading="lazy"
        {...rest}
      />
    </div>
  );
}
