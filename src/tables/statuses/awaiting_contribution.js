import React from "react";
import { DataTable, Box, Meter, Text } from "grommet";
import { gql } from "apollo-boost";
import pluralize from "pluralize";
import { Address, Amount } from "../../components";

import calcMinimumContribution from "../../lib/calcMinimumContribution";

const query = gql`
  query ServiceNodeByStatus($offset: Int, $limit: Int) {
    serviceNodes(
      status: AWAITING_CONTRIBUTION
      offset: $offset
      limit: $limit
      orderBy: availableForStake
      direction: ASC
    ) {
      publicKey
      active
      status
      operatorFee
      stakingRequirement
      availableForStake
      contributorsNum
      maxNumOfContributions
    }
  }
`;

const table = (serviceNodes, short = "false") => {
  const snData = serviceNodes.map((s) => ({
    publicKey: s.publicKey,
    stakingRequirement: s.stakingRequirement,
    operatorFee: s.operatorFee,
    availableForStake: s.availableForStake,
    staked: s.stakingRequirement - s.availableForStake,
    percent:
      ((s.stakingRequirement - s.availableForStake) / s.stakingRequirement) *
      100,
    contributorsNum: s.contributorsNum,
    maxNumOfContributions: s.maxNumOfContributions,
    availableContributorsNum: s.maxNumOfContributions - s.contributorsNum,
    minStakingAmount: calcMinimumContribution(
      s.availableForStake,
      s.contributorsNum,
      s.maxNumOfContributions
    ),
  }));

  const columns = [
    {
      header: "Service Node",
      property: "publicKey",
      align: "start",
      render: (d) => d.publicKey && <Address address={d.publicKey} />,
    },
  ];
  if (short === "false") {
    columns.push({
      header: "Op. Fee",
      property: "operatorFee",
      render: (d) =>
        d.operatorFee && <Amount amount={d.operatorFee} metric="%" />,
    });

    columns.push({
      property: "percent",
      header: "Staked",
      render: (d) => (
        <Box pad={{ vertical: "xsmall" }}>
          <Meter
            values={[{ value: d.percent }]}
            thickness="small"
            size="small"
          />
          <Text size="xsmall">
            <Amount amount={d.staked} metric="" /> of{" "}
            <Amount amount={d.stakingRequirement} /> (
            <Amount amount={d.percent} metric="%" />)
          </Text>
        </Box>
      ),
    });

    columns.push({
      header: "Available for stake",
      property: "availableForStake",
      render: (d) =>
        d.availableForStake && (
          <Box pad={{ vertical: "xsmall" }}>
            <Amount amount={d.availableForStake} />
            <Text size="xsmall">
              {d.availableContributorsNum} of {d.maxNumOfContributions}{" "}
              {pluralize("slot", d.availableContributorsNum)} available
            </Text>
          </Box>
        ),
    });

    columns.push({
      header: "Min. contribution",
      property: "minStakingAmount",
      render: (d) =>
        d.minStakingAmount && <Amount amount={d.minStakingAmount} />,
    });
  }
  if (short === "true") {
    columns.push({
      header: "Available for stake",
      property: "availableForStake",
      render: (d) =>
        d.availableForStake && (
          <Box pad={{ vertical: "xsmall" }}>
            <Amount amount={d.availableForStake} />
            <Text size="xsmall">
              {d.availableContributorsNum} of {d.maxNumOfContributions}{" "}
              {pluralize("slot", d.availableContributorsNum)} available
            </Text>
            <Text size="xsmall">
              Fee:
              <Amount amount={d.operatorFee} metric="%" />
            </Text>
          </Box>
        ),
    });
  }
  return <DataTable columns={columns} data={snData} resizeable />;
};

export { query, table };
