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
    <Box component={motion[component]} variants={variants}>
      <Typography variant={component} {...rest}>
        {text}
      </Typography>
    </Box>
  );
}
