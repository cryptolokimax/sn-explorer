import React from "react";
import moment from "moment";
import { Box, Text } from "grommet";
import NumberFormat from "react-number-format";
import useResponsive from "../lib/useResponsive";

const Height = (props) => {
  const { height: heightObject, color = null } = props;
  const r = useResponsive();

  const { height, heightDate, inFuture } = heightObject;
  return (
    <Box
      align={r({ default: "left", medium: "center" })}
      justify="center"
      pad="small"
      direction={r({ default: "column", medium: "row" })}
    >
      <Box
        align={r({ default: "left", medium: "center" })}
        justify="center"
        pad="xsmall"
        border={{ size: "xsmall", style: "solid", color: color || "accent-1" }}
        round="small"
        margin={{ right: "small" }}
        style={{ width: "fit-content", minWidth: "80px" }}
      >
        <Text color={color || "dark-1"}>
          <NumberFormat value={height} displayType="text" thousandSeparator />
        </Text>
      </Box>
      <Text color={color || "dark-1"}>
        {heightDate && inFuture && "~ "}
        {heightDate && moment(heightDate).format("MMM Do YYYY, h:mm:ss\xa0a")}
      </Text>
    </Box>
  );
};

export default Height;
