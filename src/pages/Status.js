import React from 'react';
import {
  Box, Heading, Text,
} from 'grommet';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {
  awaitingContributionQuery,
  awaitingCongtributionTable,
  unlockRequestedQuery,
  deregisteredByUnlockQuery,
  deregisteredByPenaltyQuery,
  activeQuery,
  decomissionedQuery,
  activeTable,
  unlockRequestedTable,
  deregisteredByUnlockTable,
  deregisteredByPenaltyTable,
  decomissionedTable,
} from '../tables/statuses';

import {
  Status, Header, Pager,
} from '../components';

import useResponsive from '../lib/useResponsive';


const queries = {
  AWAITING_CONTRIBUTION: awaitingContributionQuery,
  ACTIVE: activeQuery,
  UNLOCK_REQUESTED: unlockRequestedQuery,
  DEREGISTERED_BY_UNLOCK: deregisteredByUnlockQuery,
  DEREGISTERED_BY_PENALTY: deregisteredByPenaltyQuery,
  DECOMISSIONED: decomissionedQuery,
};
const tables = {
  AWAITING_CONTRIBUTION: awaitingCongtributionTable,
  ACTIVE: activeTable,
  UNLOCK_REQUESTED: unlockRequestedTable,
  DEREGISTERED_BY_UNLOCK: deregisteredByUnlockTable,
  DEREGISTERED_BY_PENALTY: deregisteredByPenaltyTable,
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

const resultsPerPage = 10;

function StatusPage({ match }) {
  const { params } = match;
  const { statParam, pageParam } = params;
  const status = statParam.toUpperCase();

  const r = useResponsive();

  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const offset = (page - 1) * resultsPerPage;

  const { loading, error, data } = useQuery(queries[status], {
    variables: { offset, limit: resultsPerPage },
  });

  const { loading: loadingStats, error: errorStats, data: dataStats } = useQuery(GET_SERVICE_NODE_STATS);

  if (loading || loadingStats) return null;
  if (error || errorStats) return `Error! ${error} ${errorStats}`;

  const { serviceNodes } = data;
  const { serviceNodeStats } = dataStats;

  const numOfResultsArr = serviceNodeStats.filter((s) => s.status === status);
  const numOfResults = numOfResultsArr[0].count;
  const numOfPages = Math.ceil(numOfResults / resultsPerPage);

  if (!serviceNodes) {
    return (
      <Box style={{ margin: 50 }}>
        <Heading>Service Nodes not found</Heading>
        <Text>{status}</Text>
        <Text>Change your search criteria and try again</Text>
      </Box>
    );
  }

  return (
    <>

      <Header
        value={(
          <Box align="center" justify="stretch" pad="small" flex="grow" direction="row-responsive" height="xsmall" margin={{ left: 'medium' }}>
            <Status status={status} style={r({ default: { fontSize: '20px', paddingLeft: '5px', paddingRight: '5px' }, medium: { fontSize: '55px', paddingLeft: '15px', paddingRight: '15px' }})} />
            {' '}
            <Text style={r({ default: { fontSize: '30px' }, medium: { fontSize: '55px' }})}>service nodes</Text>
          </Box>
        )}
        title=""
      />


      <Box align="center" justify="center" pad="small">
        {tables[status](serviceNodes, r({default: 'true', medium: 'false'}))}
      </Box>

      <Pager page={page} numOfPages={numOfPages} url={`/status/${statParam}/`} />

    </>
  );
}

export default StatusPage;
