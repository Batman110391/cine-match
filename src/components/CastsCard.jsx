import React from "react";
import { Card, CardHeader, SvgIcon, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function CastsCard({
  known_for_department,
  name,
  bg,
  w,
  h,
  badge = true,
  noMotion = false,
  text = true,
  noAction = false,
}) {
  return (
    <Card
      component={noMotion ? "div" : motion.div}
      {...(noMotion
        ? {}
        : {
            whileHover: { scale: 1.04 },
            whileTap: { scale: 0.95 },
          })}
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(-180deg, rgba(54,54,54,0.2), rgba(32,32,32,0.6)), url(http://image.tmdb.org/t/p/w500${bg})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        objectFit: "cover",
        height: h ? h : { xs: "240px", md: "360px" },
        width: w ? w : "280px",
        display: "flex",
        alignItems: "end",
        justifyContent: "center",
        cursor: noAction ? "inherit" : "pointer",
        border: "1px solid #ffffff70",
      }}
    >
      {badge && (
        <CardHeader
          sx={{ position: "absolute", top: 0, right: 0 }}
          action={
            known_for_department === "Acting" ? (
              <SvgIcon color="disabled" viewBox="0 0 24 24">
                <path d="M21 5h2v14h-2zm-4 0h2v14h-2zm-3 0H2c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1zm-1 12H3V7h10v10z"></path>
                <circle cx="8" cy="9.94" r="1.95"></circle>
                <path d="M11.89 15.35c0-1.3-2.59-1.95-3.89-1.95s-3.89.65-3.89 1.95V16h7.78v-.65z"></path>
              </SvgIcon>
            ) : (
              <SvgIcon color="disabled" viewBox="0 0 512 512">
                <path d="M157 21.234v16h18v-16zm180 0v16h18v-16zM153 55.232v62.002h206V55.232zm-3.89 80c-26.567 5.315-53.134 10.626-79.7 15.942l3.531 17.648L87 166.01v80.222h18V162.41l52-10.4v45.224h18v-62.002zm187.89 0v62.002h18V152.01l52 10.4v83.822h18V166.01l14.059 2.812l3.53-17.648c-26.565-5.315-53.132-10.628-79.698-15.942zm-174 80l-40.004 30.002h266.008L349 215.232zm-69.836 48l118.363 82.854c-37.367 27.406-74.74 54.805-112.105 82.213l10.642 14.514l18.743-13.745l-8.008 20.823l-37.332 26.13l10.322 14.745L256 377.216c54.07 37.851 108.142 75.698 162.21 113.55l10.323-14.745l-37.332-26.13l-8.008-20.823l18.743 13.745l10.642-14.514c-37.367-27.406-74.737-54.809-112.105-82.213l118.363-82.854h-31.383l-102.307 71.616l-13.927-10.215l83.728-61.4H324.51L256 313.472l-68.51-50.24h-30.437l83.728 61.4l-13.927 10.215l-102.307-71.616zM256 335.793l13.574 9.955L256 355.25l-13.574-9.502zm-28.9 21.193l13.209 9.246l-93.125 65.188l8.48-22.047zm57.8 0l71.436 52.387l8.48 22.047l-93.125-65.186z" />
              </SvgIcon>
            )
          }
        />
      )}
      {(text || !bg) && (
        <Typography
          sx={{
            mb: 1,
            textAlign: "center",
            userSelect: "none",
            letterSpacing: ".1em",
            textShadow: `-1px -1px 1px #1111116b,
          2px 2px 1px #36363691`,
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
          variant="button"
          fontWeight="bold"
        >
          {name}
        </Typography>
      )}
    </Card>
  );
}
