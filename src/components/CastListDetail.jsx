import { useTheme } from "@emotion/react";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Divider,
  ListItemButton,
  ListSubheader,
  Typography,
  useMediaQuery,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { MAX_CAST_VISUALIZATION } from "../utils/constant";
import SubHeader from "./SubHeader";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { fetchCounties } from "../api/tmdbApis";
import { useQuery } from "react-query";
import moment from "moment";
import "moment/locale/it";
import { RELEASE_TYPE } from "./DialogMovieDetail";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CastListDetail({
  person,
  crew,
  release,
  info,
  height,
  openDialogPersonDetail,
  isDesktop,
  sx,
}) {
  const [maxPersonRow, setMaxPersonRow] = React.useState(
    MAX_CAST_VISUALIZATION
  );
  const [value, setValue] = React.useState(0);

  const { isLoading, error, data } = useQuery(["countries-details"], () =>
    fetchCounties()
  );

  const filterPersonForMobile = isDesktop
    ? person.slice(0, 30)
    : person.slice(0, maxPersonRow);

  const sortingCrewByPopularity =
    crew && crew?.length > 0
      ? crew.sort((a, b) => b.popularity - a.popularity)
      : [];

  const filterCrewForMobile = isDesktop
    ? sortingCrewByPopularity.slice(0, 30)
    : sortingCrewByPopularity.slice(0, maxPersonRow);

  const handleClickViewAll = () => {
    setMaxPersonRow(person.length - 1);
  };

  const handleClickViewMaxRow = () => {
    setMaxPersonRow(MAX_CAST_VISUALIZATION);
  };

  const handleClickItem = (personID) => {
    openDialogPersonDetail(personID);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!filterPersonForMobile.length > 0 && !filterCrewForMobile.length > 0) {
    return <></>;
  }

  return (
    <List
      sx={{
        width: "100%",
        maxHeight: { xs: "inherit", md: height ? `${height}px` : "50vh" },
        overflowY: { xs: "inherit", md: "auto" },
        ...sx,
      }}
      subheader={
        <ListSubheader
          sx={{
            bgcolor: (theme) => theme.palette.background.paper,
            borderRadius: (theme) => theme.spacing(0.5),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Typography sx={{ fontSize: "0.7rem" }} variant={"button"}>
                  {"Cast"}
                </Typography>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Typography sx={{ fontSize: "0.7rem" }} variant={"button"}>
                  {"Crew"}
                </Typography>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Typography sx={{ fontSize: "0.7rem" }} variant={"button"}>
                  {"Release"}
                </Typography>
              }
              {...a11yProps(2)}
            />
            <Tab
              label={
                <Typography sx={{ fontSize: "0.7rem" }} variant={"button"}>
                  {"Info"}
                </Typography>
              }
              {...a11yProps(3)}
            />
          </Tabs>
          {!isDesktop && maxPersonRow !== MAX_CAST_VISUALIZATION && (
            <IconButton onClick={handleClickViewMaxRow}>
              <KeyboardArrowUpIcon />
            </IconButton>
          )}
        </ListSubheader>
      }
    >
      <CustomTabPanel value={value} index={0}>
        {filterPersonForMobile.map(
          ({ profile_path, name, id, known_for_department, character }, i) => {
            const labelId = `personbox-list-secondary-label-${id}`;

            return (
              <React.Fragment key={id + name + i}>
                <ListItem disableGutters>
                  <ListItemButton
                    disableGutters
                    onClick={() => handleClickItem(id)}
                    sx={{ paddingLeft: 1, gap: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${name}`}
                        variant="rounded"
                        src={`http://image.tmdb.org/t/p/w500${profile_path}`}
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      disableTypography
                      primary={
                        <Typography variant="subtitle2">{name}</Typography>
                      }
                      secondary={
                        <Typography variant="caption">{character}</Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {i < person.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          }
        )}
        {!filterPersonForMobile.length > 0 && (
          <Typography color="text.secondary" variant={"caption"} noWrap>
            {"Nessun dato presente attualmente"}
          </Typography>
        )}
        {!isDesktop &&
          maxPersonRow == MAX_CAST_VISUALIZATION &&
          person.length > MAX_CAST_VISUALIZATION && (
            <Box
              sx={{
                paddingTop: 2,
                gap: 1.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleClickViewAll}
            >
              <Typography sx={{ fontSize: "0.6rem" }} variant={"button"}>
                {"Visualizza altro"}
              </Typography>

              <KeyboardDoubleArrowDownIcon fontSize="small" />
            </Box>
          )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {filterCrewForMobile.map(
          ({ profile_path, name, id, known_for_department, job }, i) => {
            const labelId = `crew-list-secondary-label-${id}`;

            return (
              <React.Fragment key={id + name + i}>
                <ListItem disableGutters>
                  <ListItemButton
                    disableGutters
                    onClick={() => handleClickItem(id)}
                    sx={{ paddingLeft: 1, gap: 2 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar ${name}`}
                        variant="rounded"
                        src={`http://image.tmdb.org/t/p/w500${profile_path}`}
                        sx={{ width: 56, height: 56 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      id={labelId}
                      disableTypography
                      primary={
                        <Typography variant="subtitle2">{name}</Typography>
                      }
                      secondary={
                        <Typography variant="caption">{job}</Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {i < crew.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            );
          }
        )}
        {!filterCrewForMobile.length > 0 && (
          <Typography color="text.secondary" variant={"caption"} noWrap>
            {"Nessun dato presente attualmente"}
          </Typography>
        )}
        {!isDesktop &&
          maxPersonRow == MAX_CAST_VISUALIZATION &&
          crew.length > MAX_CAST_VISUALIZATION && (
            <Box
              sx={{
                paddingTop: 2,
                gap: 1.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleClickViewAll}
            >
              <Typography sx={{ fontSize: "0.6rem" }} variant={"button"}>
                {"Visualizza altro"}
              </Typography>

              <KeyboardDoubleArrowDownIcon fontSize="small" />
            </Box>
          )}
      </CustomTabPanel>
      <CustomTabPanel value={value} sx={{ p: 2, pl: 0 }} index={2}>
        {release && release?.results?.length ? (
          release?.results?.map(({ iso_3166_1, release_dates }) => {
            return (
              <ListItem
                key={iso_3166_1}
                sx={{
                  paddingLeft: 1,
                  alignItems: "flex-start",
                  gap: 1,
                  flexDirection: isDesktop ? "row" : "column",
                }}
                disableGutters
              >
                <ListItemAvatar
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: 200,
                  }}
                >
                  <Avatar
                    alt={iso_3166_1}
                    sx={{ width: 20, height: 20 }}
                    src={`https://flagcdn.com/w20/${iso_3166_1.toLowerCase()}.png`}
                  />
                  <Typography variant={"caption"} noWrap>
                    {
                      data?.find((country) => country.iso_3166_1 === iso_3166_1)
                        .native_name
                    }
                  </Typography>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",

                        gap: 1,
                        ml: isDesktop ? 0 : 3.5,
                      }}
                    >
                      {release_dates?.map((rd) => {
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                            key={rd.release_date + iso_3166_1}
                          >
                            <Typography
                              sx={{
                                display: "inline",
                                width: 85,
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                              }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {moment(rd.release_date)
                                .locale("it")
                                .format("YYYY-MM-DD")}
                            </Typography>
                            <Typography variant={"caption"}>
                              {RELEASE_TYPE[rd.type - 1].label}
                            </Typography>
                            {rd.note && (
                              <Typography
                                color="text.secondary"
                                variant={"caption"}
                                // noWrap
                              >
                                {`- ${rd.note}`}
                              </Typography>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  }
                />
              </ListItem>
            );
          })
        ) : (
          <Typography color="text.secondary" variant={"caption"} noWrap>
            {"Nessun dato presente attualmente"}
          </Typography>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} sx={{ py: 2 }} index={3}>
        {Object.entries(info).map(([key, value], i) => {
          return (
            <List
              key={key + i}
              sx={{ pl: 1 }}
              subheader={
                <Typography color="text.secondary" variant={"button"} noWrap>
                  {key}
                </Typography>
              }
            >
              <Divider sx={{ my: 1 }} />
              {value.map((v, i) => (
                <ListItem key={v.id + i} disableGutters>
                  <Typography color="text.secondary" variant={"caption"} noWrap>
                    {v.name}
                  </Typography>
                </ListItem>
              ))}
            </List>
          );
        })}
      </CustomTabPanel>
    </List>
  );
}
