import React from "react";
import { Box, Heading, Text, Button } from "grommet";
import _ from "lodash";
import { Link, useHistory } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import styled from "styled-components";

import {
  awaitingContributionQuery,
  awaitingCongtributionTable,
  decomissionedQuery,
  decomissionedTable,
} from "../tables/statuses";

import { query as usersQuery, table as usersTable } from "../tables/users";

import {
  Amount,
  Logo,
  Status,
  OperatorFeeDistribution,
  SearchBox,
  Navbar,
  UnlockRequestedNodes,
} from "../components";

import StatsContainer from "../lib/statsContainer";

import useResponsive from "../lib/useResponsive";

const queries = {
  AWAITING_CONTRIBUTION: awaitingContributionQuery,
  DECOMISSIONED: decomissionedQuery,
};
const tables = {
  AWAITING_CONTRIBUTION: awaitingCongtributionTable,
  DECOMISSIONED: decomissionedTable,
};

const GET_SERVICE_NODE_STATS = gql`
  {
    serviceNodeStats {
      status
      count
    }
  }
`;

const GET_FEE_HISTOGRAM = gql`
  {
    feeHistogram {
      class
      frequency
    }
  }
`;

const GET_UNLOCK_REQUEST_BY_DAYTE = gql`
  {
    unlockRequestByDate {
      unlockDate
      number
    }
  }
`;

function Index() {
  const stats = StatsContainer.useContainer();
  const history = useHistory();

  const r = useResponsive();
  const isDesktop = r({ default: false, medium: true });

  const height = _.get(stats, "data.generalStatistics.currentHeight");
  const stakingRequirement = _.get(
    stats,
    "data.generalStatistics.currentHeight.stakingRequirement"
  );
  const activeNodesNum = _.get(stats, "data.generalStatistics.activeNodesNum");

  const { loading, error, data } = useQuery(GET_SERVICE_NODE_STATS, {
    pollInterval: 90000,
  });
  const {
    loading: loadingDecom,
    error: errorDecom,
    data: dataDecom,
  } = useQuery(queries.DECOMISSIONED, {
    variables: { offset: 0, limit: 10 },
    pollInterval: 90000,
  });

  const {
    loading: loadingAwait,
    error: errorAwait,
    data: dataAwait,
  } = useQuery(queries.AWAITING_CONTRIBUTION, {
    variables: { offset: 0, limit: 10 },
    pollInterval: 90000,
  });

  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(usersQuery, {
    variables: { offset: 0, limit: 10 },
  });

  const { loading: loadingFees, error: errorFees, data: dataFees } = useQuery(
    GET_FEE_HISTOGRAM
  );

  const {
    loading: loadingUnlocks,
    error: errorUnlocks,
    data: dataUnlocks,
  } = useQuery(GET_UNLOCK_REQUEST_BY_DAYTE);

  console.log("dataUnlocks", dataUnlocks);

  if (loading) return null;
  if (
    error ||
    errorDecom ||
    errorAwait ||
    errorUsers ||
    errorFees ||
    errorUnlocks
  ) {
    return `Error! ${error}`;
  }

  const { serviceNodeStats } = data;

  const awaitingCount = serviceNodeStats
    .filter((s) => s.status === "AWAITING_CONTRIBUTION")
    .map((s) => s.count);
  const decomissionedCount = serviceNodeStats
    .filter((s) => s.status === "DECOMISSIONED")
    .map((s) => s.count);

  return (
    <>
      <Box>
        <Navbar serviceNodeStats={serviceNodeStats} />
        <Box
          align="center"
          justify="center"
          pad="small"
          direction="row-responsive"
        >
          <div style={{ textAlign: "center" }}>
            <Logo style={{ width: 100 }} />
          </div>
          <Heading alignSelf="center" margin="medium">
            Oxen Service Nodes
          </Heading>
          <SearchBox />
        </Box>
      </Box>
      <Box
        align="center"
        justify="evenly"
        pad="small"
        direction="row-responsive"
      >
        <Box
          align="center"
          justify="center"
          pad="medium"
          round="small"
          direction="column"
        >
          <Heading>
            {height && height.height && (
              <Amount amount={height.height} metric="" />
            )}
          </Heading>
          Current Height
        </Box>
        <Box
          align="center"
          justify="center"
          pad="medium"
          round="small"
          direction="column"
        >
          <Heading>
            {stakingRequirement && <Amount amount={stakingRequirement} />}
          </Heading>
          <Text>Staking Requirement</Text>
        </Box>
        <Box
          align="center"
          justify="between"
          pad="medium"
          round="small"
          direction="column"
        >
          <Heading>
            {activeNodesNum && <Amount amount={activeNodesNum} metric="" />}
          </Heading>
          <Text>Active Nodes</Text>
        </Box>
      </Box>
      <Box
        align="start"
        justify="start"
        direction="row-responsive"
        pad={{ horizontal: "medium", vertical: "xlarge" }}
      >
        {!loadingAwait &&
          dataAwait &&
          dataAwait.serviceNodes &&
          dataAwait.serviceNodes.length > 0 && (
            <Box width={r({ default: "auto", medium: "50%" })}>
              <Status
                status="AWAITING_CONTRIBUTION"
                style={{
                  fontSize: "30px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              />
              <Box pad={{ horizontal: "small", vertical: "large" }}>
                {tables.AWAITING_CONTRIBUTION(
                  dataAwait.serviceNodes,
                  r({ default: "true", medium: "false" })
                )}
              </Box>
              <Box alignSelf="center" style={{ display: "inline-block" }}>
                {awaitingCount &&
                  awaitingCount.length > 0 &&
                  awaitingCount[0] > 10 && (
                    <Button
                      label={`View all awaiting nodes (${awaitingCount[0]})`}
                      onClick={() => {
                        history.push("/status/awaiting_contribution");
                      }}
                    />
                  )}
              </Box>
            </Box>
          )}
        {!loadingDecom &&
          dataDecom &&
          dataDecom.serviceNodes &&
          dataDecom.serviceNodes.length > 0 && (
            <Box
              pad={{ top: r({ default: "xlarge", medium: "none" }) }}
              width={r({ default: "auto", medium: "50%" })}
            >
              <Status
                status="DECOMISSIONED"
                style={{
                  fontSize: "30px",
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              />
              <Box pad={{ horizontal: "small", vertical: "large" }}>
                {tables.DECOMISSIONED(dataDecom.serviceNodes, "true")}
              </Box>
              <Box alignSelf="center" style={{ display: "inline-block" }}>
                {decomissionedCount &&
                  decomissionedCount.length > 0 &&
                  decomissionedCount[0] > 10 && (
                    <Button
                      label={`View all decomissioned nodes (${decomissionedCount[0]})`}
                      onClick={() => {
                        history.push("/status/decomissioned");
                      }}
                    />
                  )}
              </Box>
            </Box>
          )}
      </Box>
      <Box
        align="start"
        justify="between"
        direction="row-responsive"
        pad={{
          horizontal: "medium",
          vertical: r({ default: "none", medium: "small" }),
        }}
      >
        {!loadingUsers &&
          dataUsers &&
          dataUsers.userStats &&
          dataUsers.userStats.length > 0 && (
            <Box
              align="left"
              justify="start"
              direction="column"
              pad={{ horizontal: "medium", bottom: "medium" }}
              width={r({ default: "auto", medium: "50%" })}
            >
              <Heading level={2}>Top contributors</Heading>
              <Box pad={{ horizontal: "small", vertical: "large" }}>
                {usersTable(
                  dataUsers.userStats,
                  r({ default: "true", medium: "false" })
                )}
              </Box>
              <Box alignSelf="center" style={{ display: "inline-block" }}>
                <Button
                  label="View all"
                  onClick={() => {
                    history.push("/users/");
                  }}
                />
              </Box>
            </Box>
          )}
        {!loadingUnlocks &&
          dataUnlocks &&
          dataUnlocks.unlockRequestByDate &&
          dataUnlocks.unlockRequestByDate.length > 0 && (
            <Box
              align="left"
              justify="start"
              direction="column"
              pad={{ horizontal: "medium", bottom: "medium" }}
              width={r({ default: "auto", medium: "50%" })}
            >
              <Heading level={2}>Unlocking Nodes</Heading>
              <Box pad={{ horizontal: "small", vertical: "large" }}>
                <UnlockRequestedNodes
                  unlockRequestByDate={dataUnlocks.unlockRequestByDate}
                />
              </Box>
            </Box>
          )}
      </Box>
      <Box
        align="start"
        justify="between"
        direction="row-responsive"
        pad={{
          horizontal: "medium",
          vertical: r({ default: "none", medium: "small" }),
        }}
      >
        {isDesktop &&
          !loadingFees &&
          dataFees &&
          dataFees.feeHistogram &&
          dataFees.feeHistogram.length > 0 && (
            <Box
              align="left"
              justify="start"
              direction="column"
              pad={{ horizontal: "medium", bottom: "medium" }}
            >
              <Heading level={2}>Operator fee distribution</Heading>
              <Box pad={{ horizontal: "small", vertical: "large" }}>
                <OperatorFeeDistribution feeHistogram={dataFees.feeHistogram} />
              </Box>
            </Box>
          )}
      </Box>
    </>
  );
}

export default Index;
