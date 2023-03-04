import { createTheme } from "@mui/material/styles";

const primaryDark = {
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
  typography: {
    allVariants: {
      fontFamily: "Poppins, sans-serif",
    },
  },
  palette: {
    mode: "dark",
    gradient: {
      main: `linear-gradient(-180deg, ${primaryDark[800]} 0%, ${primaryDark[700]} 100%)`,
      light: `linear-gradient(135deg, ${primaryDark[600]} 0%, ${primaryDark[500]} 100%)`,
      extraLight: `linear-gradient(135deg, ${primaryDark[400]} 0%, ${primaryDark[300]} 100%)`,
    },
    background: {
      default: primaryDark[900],
      paper: primaryDark[700],
    },
  },
});
