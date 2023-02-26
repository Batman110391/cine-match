import React from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";

function BoxLayout({ children }) {
  return (
    <Box
      component={motion.main}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, transition: { duration: 1 } }}
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
      sx={{
        width: "100%",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      {children}
    </Box>
  );
}

export default BoxLayout;
