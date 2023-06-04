import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  Grow,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React from "react";
import { useQuery } from "react-query";
import { fetchPersonDetailById } from "../api/tmdbApis";
import {
  DEPARTMENT_PERSONS,
  PERSON_DETAIL_HEIGHT,
  PERSON_DETAIL_HEIGHT_MOBILE,
  PERSON_DETAIL_WIDTH,
  PERSON_DETAIL_WIDTH_MOBILE,
} from "../utils/constant";
import CastsCard from "./CastsCard";
import DataGridListCreditsPerson from "./DataGridListCreditsPerson";
import SubHeader from "./SubHeader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow in={true} ref={ref} {...props} />;
});

export default function DialogPersonDetail({
  open,
  handleClose,
  personID,
  subItemClick,
}) {
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
      value: DEPARTMENT_PERSONS,
      info: "Conosciuto per:",
    },
    { key: "place_of_birth", info: "Nato a:" },
  ];

  return (
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
      {isLoading && !error ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <h1>{JSON.stringify(error)}</h1>
      ) : (
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
                  text={false}
                  noMotion={true}
                  noAction={true}
                />
                {personalInformation && personalInformation?.length > 0 && (
                  <Stack gap={1}>
                    {personalInformation.map(({ key, info, value }) => {
                      if (!data?.[key]) {
                        return null;
                      }

                      const translate = value ? value[data[key]] : data[key];

                      return (
                        <Stack
                          flexDirection={"row"}
                          flexWrap={"wrap"}
                          key={"infoPerson" + key}
                        >
                          <Typography
                            sx={{ mr: 1.2 }}
                            fontWeight={"bold"}
                            fontSize={"0.8rem"}
                          >
                            {info}
                          </Typography>
                          <Typography fontSize={"0.75rem"}>
                            {translate}
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <SubHeader title={"Crediti"}>
                <DataGridListCreditsPerson
                  isDesktop={isDesktop}
                  data={[...(data?.cast || []), ...(data?.crew || [])]}
                  subItemClick={subItemClick}
                />
              </SubHeader>
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
      )}
    </Dialog>
  );
}
