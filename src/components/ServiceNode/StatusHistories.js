import React from "react";
import { DataTable } from "grommet";
import _ from "lodash";
import { Height, Status } from "..";

const StatusHistories = ({ statusHistories }) => {
  const statusData = statusHistories.map((r) => ({
    status: r.status,
    height: r.height,
    heightNum: `${r.height.height}-${r.status}`,
  }));

  const statusDataSorted = _.orderBy(
    statusData,
    [
      function (o) {
        return o.height.height;
      },
    ],
    ["desc"]
  );

  return (
    <DataTable
      columns={[
        {
          header: "Height",
          property: "heightNum",
          primary: true,
          render: (d) => d.height && <Height height={d.height} />,
        },
        {
          header: "Status",
          property: "status",
          render: (d) => d.status && <Status status={d.status} />,
        },
      ]}
      data={statusDataSorted}
    />
  );
};

export default StatusHistories;
