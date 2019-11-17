import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Heading, Text, Button,
} from 'grommet';
import { LinkPrevious, LinkNext } from 'grommet-icons';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {
  awaitingContributionQuery,
  awaitingCongtributionTable,
  activeQuery,
  activeTable,
} from '../lib/statuses';

import {
  Status, Header,
} from '../components';

const queries = { AWAITING_CONTRIBUTION: awaitingContributionQuery, ACTIVE: activeQuery };
const tables = { AWAITING_CONTRIBUTION: awaitingCongtributionTable, ACTIVE: activeTable };


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

  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const offset = (page - 1) * resultsPerPage;

  const history = useHistory();

  const { loading, error, data } = useQuery(queries[status], {
    variables: { status, offset, limit: resultsPerPage },
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
          <Box align="center" justify="stretch" pad="small" flex="grow" direction="row" height="xsmall" margin={{ left: 'medium' }}>
            <Status status={status} style={{ fontSize: '55px', paddingLeft: '15px', paddingRight: '15px' }} />
            {' '}
            <Text style={{ fontSize: '55px' }}>service nodes</Text>
          </Box>
        )}
        title=""
      />


      <Box align="center" justify="center" pad="small">
        {tables[status](serviceNodes)}
      </Box>

      <Box align="center" justify="center" pad="large" direction="row">
        <Button
          icon={<LinkPrevious />}
          label="Previous"
          onClick={() => { history.push(`/status/${statParam}/${page - 1}`); }}
          disabled={page === 1}
        />
        <Text style={{ paddingLeft: 15, paddingRight: 15 }}>
          {page}
          {' '}
of
          {' '}
          {numOfPages}
        </Text>
        <Button
          icon={<LinkNext />}
          label="Next"
          onClick={() => { history.push(`/status/${statParam}/${page + 1}`); }}
          disabled={page === numOfPages}
        />
      </Box>

    </>
  );
}

export default StatusPage;
