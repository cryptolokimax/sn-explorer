import React from "react";
import { DataTable } from "grommet";
import moment from "moment";

const VersionHistories = ({ versionHistories }) => {
  const versionData = versionHistories.map((r) => ({
    version: r.version && r.version.version,
    date: moment(r.createdAt).format("MMM Do YYYY, h:mm:ss\xa0a"),
  }));
  return (
    <DataTable
      columns={[
        { header: "Date", property: "date", primary: true },
        { header: "Version", property: "version" },
      ]}
      data={versionData}
    />
  );
};

export default VersionHistories;
