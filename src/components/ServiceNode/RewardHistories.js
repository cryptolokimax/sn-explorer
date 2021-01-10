import React from "react";
import { DataTable } from "grommet";
import { Height, Amount } from "..";
import useResponsive from "../../lib/useResponsive";

const RewardHistories = ({ rewardHistories }) => {
  const r = useResponsive();
  const isDesktop = r({ default: false, medium: true });

  const rewardData = rewardHistories.map((r) => ({
    reward: r.reward,
    priceBTC: r.height.priceBTC,
    priceUSD: r.height.priceUSD,
    height: r.height,
    heightNum: r.height.height + r.reward,
  }));
  const columns = [
    {
      header: "Height",
      property: "heightNum",
      primary: true,
      render: (d) => d.height && <Height height={d.height} />,
    },
    {
      header: "Reward",
      property: "reward",
      render: (d) => d.reward && <Amount amount={d.reward} decimalScale={4} />,
    },
  ];
  if (isDesktop) {
    columns.push({
      header: "BTC",
      property: "priceBTC",
      render: (d) =>
        d.reward &&
        d.priceBTC && (
          <Amount amount={d.reward * d.priceBTC} decimalScale={4} metric="" />
        ),
    });
    columns.push({
      header: "USD",
      property: "priceUSD",
      render: (d) =>
        d.reward &&
        d.priceUSD && (
          <Amount amount={d.reward * d.priceUSD} decimalScale={4} metric="" />
        ),
    });
  }

  return <DataTable columns={columns} data={rewardData} />;
};

export default RewardHistories;
