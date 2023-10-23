import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SubHeader({
  title,
  actions,
  children,
  noAction = false,
  startHidden,
  sx,
}) {
  const [view, setView] = React.useState(startHidden ? false : true);

  const handleToggleViewChildren = () => {
    setView(!view);
  };

  const defaultActions = [
    {
      icon: view ? (
        <VisibilityIcon fontSize="small" />
      ) : (
        <VisibilityOffIcon fontSize="small" />
      ),
      props: { onClick: handleToggleViewChildren },
    },
  ];

  return (
    <Box sx={{ py: 1.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 0.5,
          borderBottom: (theme) => `1px solid ${theme.palette.text.primary}`,
        }}
      >
        <Typography sx={{ fontSize: "0.7rem" }} variant={"button"}>
          {title}
        </Typography>
        {actions &&
          !noAction &&
          Array.isArray(actions) &&
          actions.length > 0 &&
          actions.map((action, index) => {
            return (
              <IconButton key={`subHeader-${index}`} {...action.props}>
                {action.icon}
              </IconButton>
            );
          })}
        {!actions &&
          !noAction &&
          defaultActions.map((action, index) => {
            return (
              <IconButton key={`subHeader-${index}`} {...action.props}>
                {action.icon}
              </IconButton>
            );
          })}
      </Box>
      {children && (
        <Box sx={{ height: view ? "100%" : "0px", overflow: "hidden", ...sx }}>
          {children}
        </Box>
      )}
    </Box>
  );
}
