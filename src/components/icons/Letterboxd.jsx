import * as React from "react";
import { orange } from "@mui/material/colors";
import SvgIcon from "@mui/material/SvgIcon";

function SvgLetterboxdIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M8.29 16.752V7.2H6.546V4.8h6.328v2.4h-1.746v9.574h3.925v-2.618h2.839V19.2H6.545v-2.448h1.746zM0 12c0 6.628 5.372 12 12 12s12-5.372 12-12S18.628 0 12 0S0 5.372 0 12z"></path>
    </SvgIcon>
  );
}

export default function Letterboxd({ noMargin }) {
  return <SvgLetterboxdIcon sx={{ color: orange[600], m: noMargin ? 0 : 1 }} />;
}
