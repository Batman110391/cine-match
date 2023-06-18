import { Box, Dialog, Grow, SwipeableDrawer } from "@mui/material";
import React from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogWrapperResponsivness({
  open,
  onClose,
  isDesktop,
  children,
  maxWidth = "md",
  ...rest
}) {
  const iOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  return isDesktop ? (
    <Dialog
      fullScreen={isDesktop ? false : true}
      fullWidth={true}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      {...rest}
    >
      {children}
    </Dialog>
  ) : (
    <SwipeableDrawer
      anchor={"bottom"}
      open={open}
      onClose={onClose}
      onOpen={() => console.log("open")}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box sx={{ width: "100%", minHeight: "100vh" }}>{children}</Box>
    </SwipeableDrawer>
  );
}
