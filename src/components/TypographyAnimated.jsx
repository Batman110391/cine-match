import React from "react";
import { motion } from "framer-motion";
import { Box, Typography } from "@mui/material";

export default function TypographyAnimated({
  component,
  variants,
  text,
  ...rest
}) {
  return (
    <Box
      component={motion[component]}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Typography variant={component} {...rest}>
        {text}
      </Typography>
    </Box>
  );
}
