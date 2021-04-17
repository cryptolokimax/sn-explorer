import React, { useState } from "react";
import { Box, Heading, Text, DataTable, Stack, Meter, Button } from "grommet";
import _ from "lodash";
import useClipboard from "react-use-clipboard";
import { Address, Amount } from "..";

import useResponsive from "../../lib/useResponsive";
import calcMinimumContribution from "../../lib/calcMinimumContribution";

const Contributors = ({
  contributions,
  totalContributed,
  stakingRequirement,
  totalReserved,
  status = "",
  publicKey,
}) => {
  const [highlightPublicKey, setHighlightPublicKey] = useState("");
  const [isCopied, setCopied] = useClipboard(publicKey);

  const r = useResponsive();

  const contributorData = _.sortBy(
    _.uniqBy(contributions, (c) =>
      c.contributor ? c.contributor.address : ""
    ),
    (c) => !c.isOperator
  ).map((c) => ({
    publicKey: _.get(c, "contributor.address", ""),
    amount: c.amount,
    percent: c.percent,
    isOperator: c.isOperator ? "Operator" : "",
  }));

  const contributorHighlighted = contributorData.map((c) =>
    c.publicKey === highlightPublicKey ? "light-1" : ""
  );

  const contributorGraphData = contributorData.map((c) => ({
    label: c.publicKey,
    value: c.percent,
    highlight: c.publicKey === highlightPublicKey,
    onHover: (over) => setHighlightPublicKey(over ? c.publicKey : ""),
  }));

  if (totalContributed < stakingRequirement) {
    contributorGraphData.push({
      label: "not contributed",
      value: ((stakingRequirement - totalContributed) / totalContributed) * 100,
      color: "light-1",
    });
  }

  const fullyStaked =
    stakingRequirement === totalContributed &&
    totalContributed === totalReserved;

  const minStakingAmount =
    totalContributed < stakingRequirement &&
      contributions &&
      contributions.length
      ? calcMinimumContribution(
        stakingRequirement - totalContributed,
        contributions.length
      )
      : 0;

  const columns = r({
    default: [
      {
        header: "Contributor address",
        property: "publicKey",
        primary: true,
        render: (d) =>
          d.publicKey && <Address address={d.publicKey} type="user" />,
      },
      {
        property: "amount",
        header: "Amount",
        sortable: true,
        aggregate: "sum",
        footer: { aggregate: true },
        render: (d) =>
          d.amount &&
          d.percent && (
            <div>
              <Amount amount={d.amount} /> (
              <Amount amount={d.percent} metric="%" />)
              {d.isOperator && <div>operator</div>}
            </div>
          ),
      },
    ],
    medium: [
      {
        header: "Contributor address",
        property: "publicKey",
        primary: true,
        render: (d) =>
          d.publicKey && <Address address={d.publicKey} type="user" />,
      },
      {
        property: "amount",
        header: "Amount",
        sortable: true,
        aggregate: "sum",
        footer: { aggregate: true },
        render: (d) => d.amount && <Amount amount={d.amount} />,
      },
      {
        header: "%",
        property: "percent",
        sortable: false,
        aggregate: "sum",
        footer: { aggregate: true },
        render: (d) => d.percent && <Amount amount={d.percent} metric="%" />,
      },
      { property: "isOperator" },
    ],
  });

  return (
    <Box pad={r({ default: "small", medium: "medium" })}>
      <Box
        align={r({ default: "left", medium: "center" })}
        justify="start"
        direction={r({ default: "column", medium: "row" })}
      >
        <Box align="start" justify="center" pad="small">
          <Heading size="small" margin={{ bottom: "large" }}>
            Contributors
          </Heading>
          <Box align="center" justify="center" pad="small">
            <DataTable
              columns={columns}
              data={contributorData}
              background={contributorHighlighted}
            />
          </Box>
        </Box>
        <Box
          align={r({ default: "left", medium: "center" })}
          justify="center"
          pad="small"
          margin={r({ default: {}, medium: { left: "xlarge" } })}
          style={{ width: "fit-content" }}
        >
          <Stack anchor="center">
            <Meter values={contributorGraphData} round={false} type="circle" />
            <Box
              align={r({ default: "left", medium: "center" })}
              justify="center"
              pad="small"
            >
              {fullyStaked ? (
                <>
                  <Heading truncate={false} size="small" textAlign="center">
                    100%
                  </Heading>
                  <Text textAlign="center">staked</Text>
                </>
              ) : (
                <>
                  <Heading truncate={false} size="small" textAlign="center">
                    <Amount amount={stakingRequirement - totalReserved} /> (
                    <Amount
                      amount={
                        ((stakingRequirement - totalReserved) /
                          stakingRequirement) *
                        100
                      }
                      metric="%"
                    />
                    )
                  </Heading>
                  <Text textAlign="center">
                    {status === "DEREGISTERED_BY_UNLOCK" ? (
                      "wasn't contributed"
                    ) : (
                      <span>
                        available for contribution
                        <br />
                        (min <Amount amount={minStakingAmount} />)
                      </span>
                    )}
                  </Text>
                </>
              )}
            </Box>
          </Stack>
        </Box>
      </Box>
      {!fullyStaked && (
        <Text>
          <a
            href="https://docs.oxen.io/using-the-oxen-blockchain/oxen-service-node-guides/staking-to-shared-service-node"
            rel="noopener noreferrer"
            target="_blank"
          >
            Follow GUI staking guide
          </a>{" "}
          to contribute <Amount amount={minStakingAmount} /> or more to this
          Service Node.{" "}
          <Button onClick={setCopied} label="Copy SN public key" />{" "}
        </Text>
      )}
    </Box>
  );
};

export default Contributors;
