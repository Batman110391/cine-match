import React from "react";
import { motion } from "framer-motion";
import { Box, Button } from "@mui/material";

export default function ButtonAnimated({ variants, title, ...rest }) {
  return (
    <Box component={motion.div} variants={variants}>
      <Button {...rest}>{title}</Button>
    </Box>
  );
}
