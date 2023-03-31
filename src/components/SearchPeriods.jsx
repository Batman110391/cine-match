import dayjs from "dayjs";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import MobileDataPicker from "./MobileDataPicker";

export default function SearchPeriods({ onSelectPeriod }) {
  const { from, to } = useSelector((state) => state.movieQuery.rangeDate);

  const [initialDate, setInitialDate] = React.useState(
    from || dayjs(new Date()).subtract(25, "year")
  );
  const [lastDate, setLastDate] = React.useState(to || dayjs(new Date()));

  const [errorLastDate, setErrorLastDate] = React.useState(false);
  const [errorInitialDate, setErrorInitialDate] = React.useState(false);

  useEffect(() => {
    if (errorLastDate || errorInitialDate) {
      onSelectPeriod({ from: initialDate, to: lastDate, error: true });
    } else {
      onSelectPeriod({ from: initialDate, to: lastDate, error: false });
    }
  }, [initialDate, errorLastDate, errorInitialDate]);

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
