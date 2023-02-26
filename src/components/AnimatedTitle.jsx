import { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function AnimatedTitle({ text }) {
  const ctrls = useAnimation();

  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      ctrls.start("visible");
    }
    if (!inView) {
      ctrls.start("hidden");
    }
  }, [ctrls, inView]);

  const wordAnimation = {
    hidden: {},
    visible: {},
  };

  const characterAnimation = {
    hidden: {
      opacity: 0,
      y: `0.25em`,
    },
    visible: {
      opacity: 1,
      y: `0em`,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  return (
    <Typography
      variant="h2"
      sx={{ fontSize: "3rem", fontWeight: "600" }}
      aria-label={text}
      role="heading"
    >
      {text.split(" ").map((word, index) => {
        return (
          <Box
            ref={ref}
            component={motion.span}
            sx={{
              display: "inline-block",
              marginRight: "0.25em",
              whiteSpace: "nowrap",
            }}
            aria-hidden="true"
            key={index}
            initial="hidden"
            animate={ctrls}
            variants={wordAnimation}
            transition={{
              delayChildren: index * 0.25,
              staggerChildren: 0.05,
            }}
          >
            {word.split("").map((character, index) => {
              return (
                <Box
                  component={motion.span}
                  sx={{ display: "inline-block", marginRight: "-0.05em" }}
                  aria-hidden="true"
                  key={index}
                  variants={characterAnimation}
                >
                  {character}
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Typography>
  );
}
