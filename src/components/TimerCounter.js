import React, { useState, useEffect } from "react";
import moment from "moment";
import { Box, Text } from "grommet";
import { Alert } from "grommet-icons";

import useResponsive from "../lib/useResponsive";

const timeString = (value, metric) =>
  value
    ? `${Math.abs(value)} ${metric}${Math.abs(value) > 1 ? "" /* 's' */ : ""} `
    : "";

const TimerCounter = ({
  dateTime,
  title = null,
  titleSize = "medium",
  size = "medium",
  color,
  warningThreshold = 0,
  textStyle = {},
}) => {
  const dateTimeMomentInitial = moment.duration(
    moment().diff(moment(dateTime))
  );
  const [currentDateTime, setCurrentDateTime] = useState(dateTimeMomentInitial);
  const r = useResponsive();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDateTimeMomentNew = moment.duration(
        moment().diff(moment(dateTime))
      );
      setCurrentDateTime(currentDateTimeMomentNew);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentDateTime, dateTime]);

  const [seconds, minutes, hours, days, months, years] = [
    currentDateTime.seconds(),
    currentDateTime.minutes(),
    currentDateTime.hours(),
    currentDateTime.days(),
    currentDateTime.months(),
    currentDateTime.years(),
  ];
  const currentDateTimeString = `${timeString(years, "year")}${timeString(
    months,
    "month"
  )}${timeString(days, "day")}${timeString(hours, "hr")}${timeString(
    minutes,
    "min"
  )}${timeString(seconds, "sec")}`;
  const showWarning =
    warningThreshold > 0 && currentDateTime.asMinutes() > warningThreshold; // Display if more than warningThreshold minutes passed
  const inFuture = currentDateTime.asMinutes() < 0;
  return (
    <Box
      direction={r({ default: "column", medium: "row" })}
      margin={{ right: "small", left: "small" }}
    >
      {currentDateTimeString && showWarning && (
        <Box margin={{ right: "small", left: "small" }}>
          <Alert color="accent-4" />
        </Box>
      )}
      {title && (
        <Text size={titleSize} color={color}>
          {title}
          &nbsp;
        </Text>
      )}
      {currentDateTimeString && (
        <Text size={size} color={color} style={textStyle}>
          {inFuture && "in "}
          {currentDateTimeString}
          {!inFuture && " ago"}
        </Text>
      )}
    </Box>
  );
};

export default TimerCounter;
