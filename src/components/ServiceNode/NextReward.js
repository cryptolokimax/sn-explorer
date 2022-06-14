import React from "react";
import { Heading, Box, Text } from "grommet";
import moment from "moment";
import pluralize from "pluralize";
import _ from "lodash";

const NextReward = ({ stats, lastRewardBlockHeight, unlockingNodes }) => {
  const currentHeight = _.get(
    stats,
    "data.generalStatistics.currentHeight.height",
    0
  );
  const activeNodesNum = _.get(
    stats,
    "data.generalStatistics.activeNodesNum",
    0
  );
  const lastRewardHeight = lastRewardBlockHeight.height;

  const blocksToGo = lastRewardHeight - currentHeight + activeNodesNum;
  const nextRewardDurationBeforeUnlocked = moment.duration(
    2 * blocksToGo,
    "minutes"
  );
  const nextRewardDurationBeforeUnlockedDate = moment().add(
    nextRewardDurationBeforeUnlocked
  );

  console.log("unlockingNodes", unlockingNodes);
  const blocksToUnlock =
    unlockingNodes &&
    unlockingNodes.serviceNodes &&
    unlockingNodes.serviceNodes.length > 0
      ? unlockingNodes.serviceNodes.reduce((prev, current) => {
          console.log("current", current);
          return moment(current.requestedUnlockHeight.heightDate).isBefore(
            nextRewardDurationBeforeUnlockedDate
          )
            ? prev + 1
            : prev;
        }, 0)
      : 0;

  console.log("blocksToUnlock", blocksToUnlock);

  const nextRewardDuration = moment.duration(
    2 * (blocksToGo - blocksToUnlock),
    "minutes"
  );

  return (
    blocksToGo > 0 && (
      <Box
        align="center"
        justify="stretch"
        pad="small"
        background={{ color: "accent-1" }}
        round="medium"
        direction="column"
        margin={{ left: "large" }}
      >
        <Heading level="2" margin="small">
          Next reward:
        </Heading>
        <Heading level="2" margin="small">
          ~ in {blocksToGo} {pluralize("block", blocksToGo)}
        </Heading>
        <Text>
          {moment().add(nextRewardDuration).format("MMM Do YYYY, h:mm a")}
        </Text>
        <Text>
          (in{" "}
          {nextRewardDuration.days()
            ? nextRewardDuration.days() * 24 + nextRewardDuration.hours()
            : nextRewardDuration.hours()}{" "}
          hrs {nextRewardDuration.minutes()} min)
        </Text>
      </Box>
    )
  );
};

export default NextReward;
