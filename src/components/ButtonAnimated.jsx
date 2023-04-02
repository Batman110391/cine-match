import React from "react";
import { motion } from "framer-motion";
import { Box, Button } from "@mui/material";

export default function ButtonAnimated({ variants, title, ...rest }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button {...rest}>{title}</Button>
    </Box>
  );
}
