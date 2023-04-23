import { createTheme } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";
import { green, orange, red, yellow } from "@mui/material/colors";

const next = "/images/svg/next.svg";
const prev = "/images/svg/prev.svg";

const primaryDarkBlu = {
  100: "#CEE0F3",
  200: "#91B9E3",
  300: "#5090D3",
  400: "#265D97",
  500: "#1E4976",
  600: "#173A5E",
  700: "#132F4C",
  800: "#001E3C",
  900: "#0A1929",
};

export const darkTheme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "#root": {
          height: "100%",
          width: "100%",
        },
        html: {
          height: "100%",
          width: "100%",
        },
        body: {
          ...darkScrollbar(),
          height: "100%",
          width: "100%",
        },
        ".swiper-slide-active": {
          zIndex: 3,
        },
        ".swiper-button-next": {
          backgroundImage: `url(${next})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          width: "40px!important",
          opacity: "0.9",
          "&:after": {
            display: "none",
          },
        },
        ".swiper-button-prev": {
          backgroundImage: `url(${prev})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% auto",
          backgroundPosition: "center",
          width: "40px!important",
          opacity: "0.9",
          "&:after": {
            display: "none",
          },
        },
      },
    },
  },
  typography: {
    allVariants: {
      fontFamily: "Poppins, sans-serif",
    },
  },
  palette: {
    mode: "dark",
    gradient: {
      main: `linear-gradient(-180deg, ${primaryDarkBlu[800]} 0%, ${primaryDarkBlu[700]} 100%)`,
      light: `linear-gradient(135deg, ${primaryDarkBlu[600]} 0%, ${primaryDarkBlu[500]} 100%)`,
      extraLight: `linear-gradient(135deg, ${primaryDarkBlu[400]} 0%, ${primaryDarkBlu[300]} 100%)`,
      opacityBgBottom:
        "linear-gradient(90deg,#14181d 0,rgba(20,24,29,.986) .97%,rgba(20,24,29,.945) 2.07833333%,rgba(20,24,29,.883) 3.29666667%,rgba(20,24,29,.803) 4.60166667%,rgba(20,24,29,.711) 5.96666667%,rgba(20,24,29,.61) 7.365%,rgba(20,24,29,.504) 8.77166667%,rgba(20,24,29,.398) 10.16%,rgba(20,24,29,.296) 11.505%,rgba(20,24,29,.203) 12.78%,rgba(20,24,29,.122) 13.95833333%,rgba(20,24,29,.059) 15.01666667%,rgba(20,24,29,.016) 15.92833333%,rgba(20,24,29,0) 16.66666667%,rgba(20,24,29,0) 83.33333333%,rgba(20,24,29,.016) 84.07166667%,rgba(20,24,29,.059) 84.98333333%,rgba(20,24,29,.122) 86.04166667%,rgba(20,24,29,.203) 87.22%,rgba(20,24,29,.296) 88.495%,rgba(20,24,29,.398) 89.84%,rgba(20,24,29,.504) 91.22833333%,rgba(20,24,29,.61) 92.635%,rgba(20,24,29,.711) 94.03333333%,rgba(20,24,29,.803) 95.39833333%,rgba(20,24,29,.883) 96.70333333%,rgba(20,24,29,.945) 97.92166667%,rgba(20,24,29,.986) 99.03%,#14181d),linear-gradient(0deg,#14181d 0,#14181d 21.48148148%,rgba(20,24,29,.986) 23.63703704%,rgba(20,24,29,.945) 26.1%,rgba(20,24,29,.883) 28.80740741%,rgba(20,24,29,.803) 31.70740741%,rgba(20,24,29,.711) 34.74074074%,rgba(20,24,29,.61) 37.84814815%,rgba(20,24,29,.504) 40.97407407%,rgba(20,24,29,.398) 44.05925926%,rgba(20,24,29,.296) 47.04814815%,rgba(20,24,29,.203) 49.88148148%,rgba(20,24,29,.122) 52.5%,rgba(20,24,29,.059) 54.85185185%,rgba(20,24,29,.016) 56.87777778%,rgba(20,24,29,0) 58.51851852%)",
      opacityBgTop:
        "linear-gradient(-90deg,#14181d 0,rgba(20,24,29,.986) .97%,rgba(20,24,29,.945) 2.07833333%,rgba(20,24,29,.883) 3.29666667%,rgba(20,24,29,.803) 4.60166667%,rgba(20,24,29,.711) 5.96666667%,rgba(20,24,29,.61) 7.365%,rgba(20,24,29,.504) 8.77166667%,rgba(20,24,29,.398) 10.16%,rgba(20,24,29,.296) 11.505%,rgba(20,24,29,.203) 12.78%,rgba(20,24,29,.122) 13.95833333%,rgba(20,24,29,.059) 15.01666667%,rgba(20,24,29,.016) 15.92833333%,rgba(20,24,29,0) 16.66666667%,rgba(20,24,29,0) 83.33333333%,rgba(20,24,29,.016) 84.07166667%,rgba(20,24,29,.059) 84.98333333%,rgba(20,24,29,.122) 86.04166667%,rgba(20,24,29,.203) 87.22%,rgba(20,24,29,.296) 88.495%,rgba(20,24,29,.398) 89.84%,rgba(20,24,29,.504) 91.22833333%,rgba(20,24,29,.61) 92.635%,rgba(20,24,29,.711) 94.03333333%,rgba(20,24,29,.803) 95.39833333%,rgba(20,24,29,.883) 96.70333333%,rgba(20,24,29,.945) 97.92166667%,rgba(20,24,29,.986) 99.03%,#14181d),linear-gradient(0deg,#14181d 0,#14181d 21.48148148%,rgba(20,24,29,.986) 23.63703704%,rgba(20,24,29,.945) 26.1%,rgba(20,24,29,.883) 28.80740741%,rgba(20,24,29,.803) 31.70740741%,rgba(20,24,29,.711) 34.74074074%,rgba(20,24,29,.61) 37.84814815%,rgba(20,24,29,.504) 40.97407407%,rgba(20,24,29,.398) 44.05925926%,rgba(20,24,29,.296) 47.04814815%,rgba(20,24,29,.203) 49.88148148%,rgba(20,24,29,.122) 52.5%,rgba(20,24,29,.059) 54.85185185%,rgba(20,24,29,.016) 56.87777778%,rgba(20,24,29,0) 58.51851852%)",
    },
    background: {
      default: primaryDarkBlu[900],
      paperDark: primaryDarkBlu[800],
      paper: primaryDarkBlu[700],
      light: primaryDarkBlu[400],
      dark: "#14181d",
    },
    chartPrimary: {
      middle: yellow[400],
      positive: green[400],
      negative: red[400],
    },
  },
});
