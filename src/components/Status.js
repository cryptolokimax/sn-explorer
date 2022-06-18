import React from "react";
import { Box, Text } from "grommet";
import constants from "../constants";
import { DecomReason, Amount, Address } from "./";

const Status = ({ status, extra, ...rest }) => {
  let extrastatus = <></>;
  if (extra) {
    const extraObj = JSON.parse(extra);
    console.log(extraObj);
    if (extraObj.reasons && extraObj.reasons.length > 0) {
      extrastatus = (
        <Box style={{ paddingTop: "7px" }}>
          {extraObj.reasons.map((reason, i) => (
            <>
              <DecomReason key={reason} reason={reason} color="dark-4" />
            </>
          ))}
        </Box>
      );
    }
    if (extraObj.amount && extraObj.user) {
      extrastatus = (
        <Box style={{ display: "inline-block" }}>
          <Amount amount={extraObj.amount} style={{ fontSize: 12 }} />
          <Text size="xsmall"> by </Text>
          <Address
            address={extraObj.user.address}
            type="user"
            size="xsmall"
            inline
          />
        </Box>
      );
    }
  }
  return (
    <Box>
      <Box direction="row">
        {constants.statusIconsColored[status]}
        <Text
          style={{ paddingLeft: "10px" }}
          {...rest}
          color={constants.statusColors[status]}
        >
          {constants.statusTexts[status]}
        </Text>
      </Box>
      {extrastatus}
    </Box>
  );
};

export default Status;
