import React from "react";
import moment from "moment";
import { Box, Heading, Text, Meter, Button } from "grommet";
import { StatusWarning, StatusGood, Download } from "grommet-icons";
import _ from "lodash";
import { useQuery, useLazyQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import downloadCsv from "download-csv";

import {
  Address,
  TimerCounter,
  Height,
  Amount,
  Header,
  Loader,
} from "../components";
import useResponsive from "../lib/useResponsive";

import {
  Contributors,
  DowntimeBlocksChart,
  RewardHistories,
  StatusHistories,
  NextReward,
  VersionHistories,
  PublicIPHistories,
  SwarmHistories,
  WorldMap,
} from "../components/ServiceNode";

import StatsContainer from "../lib/statsContainer";

import constants from "../constants";

const GET_SERVICE_NODE = gql`
  query ServiceNode($publicKey: String!) {
    serviceNode(publicKey: $publicKey) {
      id
      publicKey
      active
      earnedDowntimeBlocks
      decomissionCount
      stakingRequirement
      totalContributed
      totalReserved
      operatorFee
      maxNumOfContributions
      requestedUnlockHeight {
        height
        heightDate
        inFuture
      }
      registrationHeight {
        height
        stakingRequirement
        heightDate
      }
      lastRewardBlockHeight {
        height
        heightDate
      }
      publicIp {
        latitude
        longitude
        country {
          country
        }
      }
      version {
        version
      }
      contributions {
        amount
        percent
        isOperator
        contributor {
          address
        }
      }
      downtimeBlocksHistories {
        earnedDowntimeBlocks
        createdAt
      }
      totalReward
      rewardHistories {
        reward
        height {
          height
          heightDate
          priceBTC
          priceUSD
        }
      }
      statusHistories {
        status
        height {
          height
          heightDate
        }
      }
      versionHistories {
        version {
          version
        }
        createdAt
      }
      publicIPHistories {
        createdAt
      }
      swarmHistories {
        swarm {
          swarmId
        }
        createdAt
      }
    }
  }
`;

const GET_SERVICE_NODE_FREQUENT = gql`
  query ServiceNodeFrequent($publicKey: String!) {
    serviceNode(publicKey: $publicKey) {
      id
      lastUptimeProof
      storageServerReachable
      lokinetReachable
      status
    }
  }
`;

const GET_FULL_REWARDS_HISTORY = gql`
  query ServiceNode($publicKey: String!, $noLimit: Boolean) {
    serviceNode(publicKey: $publicKey, noLimit: $noLimit) {
      rewardHistories {
        reward
        height {
          height
          heightDate
          priceBTC
          priceUSD
          priceEUR
        }
      }
    }
  }
`;

const GET_UNLOCKING_NODES = gql`
  query ServiceNodeByStatus($offset: Int, $limit: Int) {
    serviceNodes(
      status: UNLOCK_REQUESTED
      offset: $offset
      limit: $limit
      orderBy: requestedUnlockHeightHeight
      direction: ASC
    ) {
      requestedUnlockHeight {
        heightDate
      }
    }
  }
`;

const GET_NEXT_TEST_HEIGHT = gql`
  query NextTestHeight($publicKey: String) {
    nextTestHeight(publicKey: $publicKey) {
      height
    }
  }
`;

function ServiceNode({ match }) {
  const r = useResponsive();

  const { params } = match;
  const { publicKey } = params;

  const { loading, error, data } = useQuery(GET_SERVICE_NODE, {
    variables: { publicKey },
    pollInterval: 30000,
  });

  const {
    loading: loadingFrequent,
    error: errorFrequent,
    data: dataFrequent,
  } = useQuery(GET_SERVICE_NODE_FREQUENT, {
    variables: { publicKey },
    pollInterval: 2000,
  });

  // Generate and Download CSV on request
  const [generateCVS] = useLazyQuery(GET_FULL_REWARDS_HISTORY, {
    variables: { publicKey, noLimit: true },
    onCompleted: (data) => {
      if (data.serviceNode && data.serviceNode.rewardHistories) {
        const csvdata = data.serviceNode.rewardHistories.map((h) => ({
          date: h.height.heightDate.substring(0, 10),
          reward: h.reward,
          btc: h.reward * h.height.priceBTC,
          usd: h.reward * h.height.priceUSD,
          eur: h.reward * h.height.priceEUR,
        }));
        const columns = {
          date: "Date",
          reward: "SN reward (OXEN)",
          btc: "SN reward (BTC)",
          usd: "SN reward (USD)",
          eur: "SN reward (EUR)",
        };

        downloadCsv(csvdata, columns, `rewards_${publicKey}.csv`);
      }
    },
  });

  const {
    loading: loadingUnlocking,
    error: errorUnlocking,
    data: dataUnlocking,
  } = useQuery(GET_UNLOCKING_NODES, {
    variables: { offset: 0, limit: 500 },
    pollInterval: 20 * 60 * 1000,
  });

  const {
    loading: loadingNextTestHeight,
    error: errorNextTestHeightg,
    data: dataNextTestHeight,
  } = useQuery(GET_NEXT_TEST_HEIGHT, {
    variables: { publicKey },
    pollInterval: 2 * 60 * 1000,
  });

  const stats = StatsContainer.useContainer();

  let nextTestDateTime = null;
  let extraNextTestDateTest = " in > 24 minutes";
  if (!loadingNextTestHeight) {
    const currentHeightDate = _.get(
      stats,
      "data.generalStatistics.currentHeight.heightDate",
      0
    );

    const currentHeight = _.get(
      stats,
      "data.generalStatistics.currentHeight.height",
      0
    );

    if (currentHeight > 0) {
      const heightDiff =
        dataNextTestHeight.nextTestHeight.height - parseInt(currentHeight);
      if (heightDiff > 0) {
        nextTestDateTime = moment(currentHeightDate).add(
          heightDiff * 2,
          "minutes"
        );
        extraNextTestDateTest = "";
      }
      if (heightDiff === 0) extraNextTestDateTest = " NOW";
    }
  }

  console.log("nextTestDateTime", nextTestDateTime);

  if (loading) return <Loader />;
  if (error || errorFrequent) return `Error! ${error} ${errorFrequent}`;

  const { serviceNode } = data;

  if (!serviceNode) {
    return (
      <Box style={{ margin: 50 }}>
        <Heading>Service Node not found</Heading>
        <Text>{publicKey}</Text>
        <Text>Change your search criteria and try again</Text>
      </Box>
    );
  }
  const { serviceNode: serviceNodeFrequent } = dataFrequent;

  const {
    active,
    requestedUnlockHeight,
    registrationHeight,
    stakingRequirement,
    totalContributed,
    totalReserved,
    operatorFee,
    maxNumOfContributions,
    contributions,
    earnedDowntimeBlocks,
    lastRewardBlockHeight,
    downtimeBlocksHistories,
    totalReward,
    rewardHistories,
    statusHistories,
    versionHistories,
    publicIPHistories,
    swarmHistories,
    publicIp,
  } = serviceNode;

  const { status, lastUptimeProof, storageServerReachable, lokinetReachable } =
    serviceNodeFrequent;

  const decomDowntimeBlocks = 1440 - earnedDowntimeBlocks;
  const downtimeDuration = moment.duration(2 * earnedDowntimeBlocks, "minutes");

  const currentVersion = _.get(versionHistories, "[0].version.version");
  const currentVersionGlobal = _.get(
    stats,
    "data.generalStatistics.currentVersion.version"
  );

  const currentStakingRequirement = _.get(
    stats,
    "data.generalStatistics.currentHeight.stakingRequirement",
    0
  );

  const currentSwarm = _.get(swarmHistories, "[0].swarm.swarmId");

  const responsiveDirection = r({ default: "column", medium: "row" });
  const responsiveAlign = r({ default: "left", medium: "center" });

  return (
    <>
      <Header
        value={<Address address={publicKey} size="large" />}
        title="SERVICE NODE"
      />
      <Box
        align={responsiveAlign}
        justify="between"
        pad="medium"
        background={{ color: constants.statusColors[status] }}
        height={r({ default: "150px", medium: "xsmall" })}
        direction={responsiveDirection}
        wrap={false}
      >
        <Box align="center" direction="row">
          {constants.statucIcons[status]}

          {status === "UNLOCK_REQUESTED" ? (
            <>
              <Text color="light-1" size="large" margin={{ left: "small" }}>
                Unlock requested on:
              </Text>
              <Height height={requestedUnlockHeight} color="light-1" />
            </>
          ) : (
            <Text color="light-1" size="large" margin={{ left: "small" }}>
              {constants.statusTexts[status]}
            </Text>
          )}
        </Box>

        <Box
          align="center"
          justify="center"
          pad="small"
          flex="grow"
          wrap={false}
          style={{ display: r({ default: "none", medium: "block" }) }}
        />

        <TimerCounter
          title="Last uptime proof:"
          dateTime={lastUptimeProof}
          titleSize={r({ default: "small", medium: "large" })}
          size="large"
          color="light-1"
          warningThreshold={90}
          textStyle={{ minWidth: 230 }}
        />
        <TimerCounter
          title={`Next test:${extraNextTestDateTest}`}
          dateTime={nextTestDateTime}
          titleSize={r({ default: "small", medium: "large" })}
          size="large"
          color="light-1"
          textStyle={{ minWidth: 230 }}
        />
      </Box>
      <Box
        align="start"
        justify="between"
        pad="small"
        direction={responsiveDirection}
        height={r({ default: "300px", medium: "120px" })}
      >
        <Box
          align={responsiveAlign}
          justify="center"
          pad={r({ default: "small", medium: "medium" })}
          direction={responsiveDirection}
          style={{ paddingTop: r({ default: "20px", medium: "0px" }) }}
        >
          <Text size="large" weight="bold">
            Registered on:
          </Text>
          <Height height={registrationHeight} />
        </Box>

        <Box
          align={r({ default: "start", medium: "end" })}
          justify="center"
          direction="column"
          style={{ alignSelf: "flex-start", paddingBottom: "40px" }}
        >
          <Box
            align={responsiveAlign}
            justify={responsiveAlign}
            pad="small"
            direction={responsiveDirection}
          >
            <Text size="large" weight="bold" margin={{ right: "small" }}>
              Staking requirement:
            </Text>
            <Text size="large">
              <Amount amount={stakingRequirement} />
              <br />
            </Text>
          </Box>
          {stakingRequirement - currentStakingRequirement > 0 && (
            <Text size="small">
              (+{" "}
              <Amount amount={stakingRequirement - currentStakingRequirement} />{" "}
              to current)
            </Text>
          )}
        </Box>

        <Box
          align={responsiveAlign}
          justify={responsiveAlign}
          pad="small"
          direction={responsiveDirection}
        >
          <Box direction="column">
            <Box align="center" direction="row">
              <Text size="large" weight="bold" margin={{ right: "small" }}>
                Operator fee:
              </Text>
              <Text size="large">
                <Amount amount={operatorFee} metric="%" />
              </Text>
            </Box>
            <Box align="center" direction="row" margin={{ top: "medium" }}>
              {storageServerReachable ? (
                <StatusGood />
              ) : (
                <StatusWarning color="status-error" />
              )}
              <Text size="large" margin={{ left: "small", right: "small" }}>
                {storageServerReachable
                  ? "Storage Server Reachable"
                  : "Storage Server NOT Reachable"}
              </Text>
            </Box>
            <Box align="center" direction="row" margin={{ top: "medium" }}>
              {lokinetReachable ? (
                <StatusGood />
              ) : (
                <StatusWarning color="status-error" />
              )}
              <Text size="large" margin={{ left: "small", right: "small" }}>
                {lokinetReachable
                  ? "Lokinet Reachable"
                  : "Lokinet NOT Reachable"}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      <Contributors
        contributions={contributions}
        totalContributed={totalContributed}
        stakingRequirement={stakingRequirement}
        totalReserved={totalReserved}
        status={status}
        publicKey={publicKey}
        maxNumOfContributions={maxNumOfContributions}
      />

      <Box
        align="start"
        justify="start"
        pad="small"
        direction={responsiveDirection}
      >
        <Box align="start" justify="center" pad="small">
          <Heading size="small">Earned downtime blocks</Heading>
          <Box
            align="center"
            justify="start"
            pad="small"
            direction={responsiveDirection}
          >
            <Meter
              values={[
                {
                  color: "accent-1",
                  label: "Earned, blocks",
                  value: earnedDowntimeBlocks,
                },
                {
                  color:
                    earnedDowntimeBlocks < 60
                      ? "status-critical"
                      : "status-unknown",
                  value: decomDowntimeBlocks,
                },
              ]}
            />
            <Heading size="small" margin={{ left: "medium" }} level="3">
              {earnedDowntimeBlocks > 0 ? (
                <span>
                  {earnedDowntimeBlocks} blocks{" "}
                  <span style={{ whiteSpace: "nowrap" }}>
                    (~{" "}
                    {downtimeDuration.days()
                      ? 24 * downtimeDuration.days() + downtimeDuration.hours()
                      : downtimeDuration.hours()}{" "}
                    hrs {downtimeDuration.minutes()} min)
                  </span>
                </span>
              ) : (
                <span>0 blocks</span>
              )}
            </Heading>
            <Box align="center" justify="center" pad="large" flex="grow" />
          </Box>
          {earnedDowntimeBlocks < 60 && (
            <Text color="status-critical">
              60 blocks required to enable deregistration delay
            </Text>
          )}
        </Box>
        <Box
          align="center"
          justify="center"
          pad="small"
          margin={r({ default: {}, medium: { left: "large" } })}
        >
          {downtimeBlocksHistories.length > 0 && (
            <DowntimeBlocksChart
              downtimeBlocksHistories={downtimeBlocksHistories}
            />
          )}
        </Box>
      </Box>
      <Box
        align={responsiveAlign}
        justify="start"
        pad="small"
        direction={responsiveDirection}
      >
        <Box align="start" justify="center" pad="small">
          <Heading size="small">
            Reward earned: <Amount amount={totalReward} />
            <Button
              onClick={() => {
                generateCVS();
              }}
              icon={<Download />}
            />
          </Heading>

          <Box
            align="center"
            justify="start"
            pad="small"
            direction={responsiveDirection}
          >
            <RewardHistories rewardHistories={rewardHistories} />
          </Box>
        </Box>
        {active && (
          <NextReward
            stats={stats}
            lastRewardBlockHeight={lastRewardBlockHeight}
            rewardHistories={rewardHistories}
            unlockingNodes={dataUnlocking}
          />
        )}
      </Box>
      <Box
        align="start"
        justify="start"
        pad="small"
        direction={responsiveDirection}
      >
        <Box align="start" justify="center" pad="small">
          <Box align="start" justify="start" pad="small" direction="column">
            <Heading size="small">Status change history</Heading>
            <StatusHistories statusHistories={statusHistories} />
          </Box>
        </Box>
        <Box
          align="start"
          justify="center"
          pad="small"
          margin={r({ default: {}, medium: { left: "large" } })}
        >
          <Box
            align="center"
            justify="start"
            pad="xsmall"
            direction={responsiveDirection}
          >
            <Box align="start" justify="center" pad="xsmall">
              <Heading size="small">Version: {currentVersion}</Heading>
            </Box>
            {currentVersion !== currentVersionGlobal ? (
              <Box align="center" justify="center" pad="small" direction="row">
                <StatusWarning color="status-error" />
                <Heading size="small" margin={{ left: "medium" }} level="3">
                  requires upgrade ({currentVersionGlobal})
                </Heading>
              </Box>
            ) : (
              <Heading size="small" margin={{ left: "medium" }} level="3">
                (latest)
              </Heading>
            )}
          </Box>
          <Box align="center" justify="center" pad="medium">
            <VersionHistories versionHistories={versionHistories} />
          </Box>
        </Box>
      </Box>
      <Box
        align={responsiveAlign}
        justify="start"
        pad="small"
        direction={responsiveDirection}
      >
        <Box align="start" justify="center" pad="small">
          <Heading size="small">IP change history</Heading>
          <Box align="center" justify="start" pad="small" direction="row">
            <PublicIPHistories publicIPHistories={publicIPHistories} />
          </Box>
        </Box>
        <Box
          align="center"
          justify="center"
          pad="small"
          margin={{ left: "xlarge" }}
          style={r({
            default: { height: 200 },
            medium: { width: "100%", maxWidth: "950px" },
          })}
        >
          <WorldMap publicIp={publicIp} />
        </Box>
      </Box>
      <Box
        align={responsiveAlign}
        justify="between"
        pad="small"
        direction="row"
      >
        <Box align="start" justify="center" pad="small">
          <Heading size="small">Swarm ID: {currentSwarm}</Heading>
          <Box align="center" justify="start" pad="small" direction="row">
            <SwarmHistories swarmHistories={swarmHistories} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default ServiceNode;
