import React from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Navigation from "./Navigation";

function BoxLayout({ withNavigation = true, children, sx }) {
  const styleBoxLayout = {
    width: "100%",
    height: "100%",
    bgcolor: "background.default",
    ...sx,
  };

  if (withNavigation) {
    return (
      <Navigation>
        <Box
          component={motion.main}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 1 } }}
          variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.default",
          }}
        >
          {children}
        </Box>
      </Navigation>
    );
  }

  return (
    <Box
      component={motion.main}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      sx={styleBoxLayout}
    >
      {children}
    </Box>
  );
}

export default BoxLayout;
