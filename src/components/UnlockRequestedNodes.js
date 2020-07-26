import React, { useState } from "react";
import moment from "moment";
import { Meter, DataTable, Box } from "grommet";

import useResponsive from "../lib/useResponsive";

const UnlockRequestedNodes = ({ unlockRequestByDate }) => {
  const r = useResponsive();
  const isDesktop = r({ default: false, medium: true });

  const columns = [
    {
      header: "Unlock Date (UTC)",
      property: "unlockDate",
      align: "start",
      render: (d) =>
        d.unlockDate && moment(d.unlockDate).format("MMM, Do YYYY"),
    },
    {
      header: "Nodes",
      property: "number",
      align: "start",
      render: (d) => d.number && d.number,
    },
  ];

  if (isDesktop)
    columns.push({
      property: "number",
      header: "",
      render: (d) => (
        <Box pad={{ vertical: "small" }}>
          <Meter
            values={[{ value: d.number }]}
            thickness="small"
            size="small"
          />
        </Box>
      ),
    });

  return <DataTable columns={columns} data={unlockRequestByDate} resizeable />;
};

export default UnlockRequestedNodes;
