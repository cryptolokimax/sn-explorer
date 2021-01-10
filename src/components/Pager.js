import React from "react";
import { Box, Text, Button } from "grommet";
import { useHistory } from "react-router-dom";

import { LinkPrevious, LinkNext } from "grommet-icons";

import useResponsive from "../lib/useResponsive";

const Pager = ({ page, numOfPages = null, url }) => {
  const history = useHistory();

  const r = useResponsive();

  return (
    <Box
      align="center"
      justify="center"
      pad={r({ default: "small", medium: "large" })}
      direction="row"
    >
      <Button
        icon={<LinkPrevious />}
        label={r({ default: "", medium: "Previous" })}
        onClick={() => {
          history.push(`${url}${page - 1}`);
        }}
        disabled={page === 1}
      />
      <Text style={{ paddingLeft: 15, paddingRight: 15 }}>
        {!numOfPages && "Page "}
        {page}
        {numOfPages && ` of ${numOfPages}`}
      </Text>
      <Button
        icon={<LinkNext />}
        label={r({ default: "", medium: "Next" })}
        onClick={() => {
          history.push(`${url}${page + 1}`);
        }}
        disabled={numOfPages && page === numOfPages}
      />
    </Box>
  );
};

export default Pager;
