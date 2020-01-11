import React from 'react';
import { DataTable } from 'grommet';
import moment from 'moment';

const SwarmHistories = ({ swarmHistories }) => {
  const swarmData = swarmHistories.map((r) => ({
    swarm: r.swarm && r.swarm.swarmId,
    date: moment(r.createdAt).format('MMM Do YYYY, h:mm:ss\xa0a'),
    dateKey: `${r.createdAt}-${r.swarm && r.swarm.swarmId}`,
  }));
  return (
    <DataTable
      columns={[
        {
          header: 'Date', property: 'dateKey', primary: true, render: (d) => d.date,
        },
        { header: 'Swarm ID', property: 'swarm' },
      ]}
      data={swarmData}
    />
  );
};

export default SwarmHistories;
