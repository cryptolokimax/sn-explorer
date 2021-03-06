import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Box, Heading, Text, Layer } from "grommet";
import { LinkPrevious } from "grommet-icons";
import moment from "moment";
import pluralize from "pluralize";
import _ from "lodash";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import NumberFormat from "react-number-format";
import Confetti from "react-confetti";

import { TimerCounter, Header } from "../components";

import StatsContainer from "../lib/statsContainer";

const GET_HEIGHT = gql`
  query Height($height: Int!) {
    height(height: $height) {
      heightDate
    }
  }
`;

function Height({ match }) {
  const { params } = match;
  const { height: heightParam } = params;

  const stats = StatsContainer.useContainer();
  const history = useHistory();

  const height = _.toNumber(heightParam);

  const isValid = Number.isInteger(height) && height > 0 && height < 5000000;

  const { loading, error, data, refetch } = useQuery(GET_HEIGHT, {
    variables: { height },
  });

  const [blockDiff, setBlockDiff] = useState(null);

  useEffect(() => {
    // fetching data for last mined block, which just was current
    if (blockDiff === -1) refetch();
  }, [blockDiff, refetch]);

  const currentHeight = _.get(
    stats,
    "data.generalStatistics.currentHeight.height",
    0
  );
  const currentHeightDate = _.get(
    stats,
    "data.generalStatistics.currentHeight.heightDate",
    0
  );

  useEffect(() => {
    setBlockDiff(currentHeight > 0 ? height - currentHeight : null);
  }, [currentHeight, height]);

  if (!isValid) {
    return (
      <Box style={{ margin: 50 }}>
        <Heading>Height not valid</Heading>
        <Text>{heightParam}</Text>
      </Box>
    );
  }

  if (currentHeight < 1 || blockDiff === null) return "";

  const inFuture = blockDiff > 0;

  const diffDuration = moment.duration(2 * blockDiff, "minutes");

  const heightDateReceived = _.get(data, "height.heightDate", null);

  const heightDate =
    !inFuture && heightDateReceived
      ? moment(heightDateReceived)
      : moment(currentHeightDate).add(diffDuration);

  const exactTime = !inFuture && !!heightDateReceived;

  return (
    <>
      <Header
        value={
          <Heading>
            <NumberFormat value={height} displayType="text" thousandSeparator />
          </Heading>
        }
        title="SERVICE NODE"
      />

      <Box
        align="center"
        justify="center"
        pad="small"
        background={{ color: "accent-4" }}
      >
        <Text size="large">
          {!exactTime && "~"} {heightDate.format("MMM Do YYYY, h:mm a")}
        </Text>
      </Box>

      <Box align="center" justify="center">
        <Box align="center" justify="center" pad="small">
          <Heading>
            {height === 641111 ? "Salty Saga hardfork" : "This block"}{" "}
            {inFuture ? "will happen" : "happened"}
          </Heading>
          <Heading size="large">
            {
              // eslint-disable-next-line no-nested-ternary
              blockDiff === 0 ? (
                "just now"
              ) : inFuture ? (
                <span>
                  in{" "}
                  <NumberFormat
                    value={blockDiff}
                    displayType="text"
                    thousandSeparator
                  />{" "}
                  {pluralize("block", blockDiff)}
                </span>
              ) : (
                <span>
                  <NumberFormat
                    value={blockDiff * -1}
                    displayType="text"
                    thousandSeparator
                  />{" "}
                  {pluralize("block", blockDiff * -1)} ago
                </span>
              )
            }
          </Heading>
          <Heading>
            {
              // eslint-disable-next-line no-nested-ternary
              blockDiff > 0 && moment(heightDate) < moment() ? (
                blockDiff === 1 ? (
                  "any time now"
                ) : (
                  "soon (current block is long)"
                )
              ) : (
                <TimerCounter
                  title={!exactTime && "~"}
                  dateTime={heightDate}
                  size="large"
                  textStyle={{ fontSize: "1em" }}
                />
              )
            }
          </Heading>
          <p>
            <Text>
              Current height:{" "}
              <NumberFormat
                value={currentHeight}
                displayType="text"
                thousandSeparator
              />
            </Text>
          </p>
        </Box>
      </Box>
      {blockDiff === 0 && <Confetti />}
    </>
  );
}

export default Height;
