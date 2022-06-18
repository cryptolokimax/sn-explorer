import React from "react";
import { Text } from "grommet";

const DecomReason = ({ reason, color }) => {
  const reasons = {
    uptime: "Missing Uptime Proofs",
    checkpoint: "Missed too many checkpoint votes",
    pulse: "Missed too many pulse quorums",
    storage: "Oxen Storage Server is not reachable",
    lokinet: "Lokinet is not reachable",
    timecheck: "SN is not responding to time checks",
    timesync: "SN's system clock is too far off",
    unknown: "Unknown reason",
  };
  return (
    <Text size="small" color={color}>
      {reasons[reason] || reasons.unknown}
    </Text>
  );
};

export default DecomReason;
