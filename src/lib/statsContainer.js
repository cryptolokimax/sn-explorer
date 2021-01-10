import { createContainer } from "unstated-next";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";

const GET_STATS = gql`
  {
    generalStatistics {
      currentHeight {
        height
        heightDate
        stakingRequirement
      }
      activeNodesNum
      currentVersion {
        version
      }
    }
  }
`;

function useStats() {
  const { loading, error, data } = useQuery(GET_STATS, {
    pollInterval: 3000,
  });
  return { loading, error, data };
}

const StatsContainer = createContainer(useStats);

export default StatsContainer;
