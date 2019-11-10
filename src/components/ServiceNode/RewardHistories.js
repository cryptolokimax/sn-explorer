import React from 'react';
import { DataTable } from 'grommet';
import { Height, Amount } from '..';

const RewardHistories = ({ rewardHistories }) => {
  const rewardData = rewardHistories.map((r) => ({
    reward: r.reward,
    height: r.height,
  }));
  return (
    <DataTable
      columns={[
        {
          header: 'Height', property: 'height', primary: true, render: (d) => (d.height && <Height height={d.height} />),
        },
        { header: 'Reward', property: 'reward', render: (d) => (d.reward && <Amount amount={d.reward} decimalScale={4} />) },
      ]}
      data={rewardData}
    />
  );
};

export default RewardHistories;
