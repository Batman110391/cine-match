import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  Grow,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { fetchPersonDetailById } from "../api/tmdbApis";
import { useQuery } from "react-query";
import CastsCard from "./CastsCard";
import {
  PERSON_DETAIL_HEIGHT,
  PERSON_DETAIL_HEIGHT_MOBILE,
  PERSON_DETAIL_WIDTH,
  PERSON_DETAIL_WIDTH_MOBILE,
} from "../utils/constant";
import { motion } from "framer-motion";
import SubHeader from "./SubHeader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogPersonDetail({ open, handleClose, personID }) {
  const theme = useTheme();

  const { isLoading, error, data } = useQuery(["personDetail", personID], () =>
    fetchPersonDetailById(personID)
  );

  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  console.log("person", data);

  const personalInformation = [
    { key: "name", info: "Nome:" },
    { key: "deathday", info: "Morto il:" },
    { key: "birthday", info: "Nato il:" },
    {
      key: "known_for_department",
      value: { Acting: "Recitazione" },
      info: "Conosciuto per:",
    },
    { key: "place_of_birth", info: "Nato a:" },
  ];

  return (
    <div>
      <Dialog
        fullScreen={isDesktop ? false : true}
        fullWidth={true}
        maxWidth={"xl"}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            height: "100%",
          },
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar sx={{ position: "relative" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          sx={{ paddingX: 1.5 }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack flexDirection={"row"} justifyContent={"center"} gap={2.5}>
                <CastsCard
                  name={data?.name}
                  bg={data?.profile_path}
                  w={
                    isDesktop ? PERSON_DETAIL_WIDTH : PERSON_DETAIL_WIDTH_MOBILE
                  }
                  h={
                    isDesktop
                      ? PERSON_DETAIL_HEIGHT
                      : PERSON_DETAIL_HEIGHT_MOBILE
                  }
                  badge={false}
                  noMotion={true}
                  noAction={true}
                />
                <Stack gap={1}>
                  {personalInformation.map(({ key, info, value }) => {
                    if (!data?.[key]) {
                      return null;
                    }

                    const translate = value ? value[data[key]] : data[key];

                    return (
                      <Stack flexDirection={"row"} flexWrap={"wrap"}>
                        <Typography
                          sx={{ mr: 2 }}
                          fontWeight={"bold"}
                          fontSize={"0.8rem"}
                        >
                          {info}
                        </Typography>
                        <Typography fontSize={"0.8rem"}>{translate}</Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <SubHeader title={"Biografia"} startHidden={true}>
                <Typography fontWeight={200} sx={{ mt: 3 }} variant={"body2"}>
                  {data?.biography}
                </Typography>
              </SubHeader>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}
