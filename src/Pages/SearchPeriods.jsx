import dayjs from "dayjs";
import React from "react";
import MobileDataPicker from "../components/MobileDataPicker";

export default function SearchPeriods() {
  const [initialDate, setInitialDate] = React.useState(
    dayjs(new Date()).subtract(25, "year")
  );
  const [lastDate, setLastDate] = React.useState(dayjs(new Date()));

  const [errorLastDate, setErrorLastDate] = React.useState(false);
  const [errorInitialDate, setErrorInitialDate] = React.useState(false);

  const props = {
    initialDate,
    setInitialDate,
    lastDate,
    setLastDate,
    setErrorInitialDate,
    setErrorLastDate,
  };

  return <MobileDataPicker props={props} />;
}
