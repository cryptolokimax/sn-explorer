import React, { useState } from 'react';
import {
  Box, Heading, TextInput, Text, Button,
} from 'grommet';
import _ from 'lodash';
import { Link, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';

import {
  awaitingContributionQuery,
  awaitingCongtributionTable,
  decomissionedQuery,
  decomissionedTable,
} from '../tables/statuses';

import {
  query as usersQuery,
  table as usersTable,
} from '../tables/users';

import {
  Height, Amount, Logo, Status,
} from '../components';

import StatsContainer from '../lib/statsContainer';

const queries = {
  AWAITING_CONTRIBUTION: awaitingContributionQuery,
  DECOMISSIONED: decomissionedQuery,
};
const tables = {
  AWAITING_CONTRIBUTION: awaitingCongtributionTable,
  DECOMISSIONED: decomissionedTable,
};

const StatusLink = styled(Link)`
    text-decoration: none;
    cursor: pointer;
    color: #333;
    :hover {
        background-color: #efefef;
    }
    :active {
        background-color: #eee;
    }
`;

const GET_SERVICE_NODE_STATS = gql`
  {
    serviceNodeStats {
      status
      count
    }
  }
`;

function Index() {
  const stats = StatsContainer.useContainer();
  const history = useHistory();
  const [search, setSearch] = useState('');

  const height = _.get(stats, 'data.generalStatistics.currentHeight');
  const stakingRequirement = _.get(stats, 'data.generalStatistics.currentHeight.stakingRequirement');
  const activeNodesNum = _.get(stats, 'data.generalStatistics.activeNodesNum');

  const { loading, error, data } = useQuery(GET_SERVICE_NODE_STATS, {
    pollInterval: 90000,
  });
  const { loading: loadingDecom, error: errorDecom, data: dataDecom } = useQuery(queries.DECOMISSIONED, {
    variables: { offset: 0, limit: 10 },
    pollInterval: 90000,
  });

  const { loading: loadingAwait, error: errorAwait, data: dataAwait } = useQuery(queries.AWAITING_CONTRIBUTION, {
    variables: { offset: 0, limit: 10 },
    pollInterval: 90000,
  });

  const { loading: loadingUsers, error: errorUsers, data: dataUsers } = useQuery(usersQuery, {
    variables: { offset: 0, limit: 10 },
  });

  if (loading) return null;
  if (error || errorDecom || errorAwait || errorUsers) return `Error! ${error}`;

  const { serviceNodeStats } = data;

  const awaitingCount = serviceNodeStats.filter((s) => s.status === 'AWAITING_CONTRIBUTION').map((s) => s.count);
  const decomissionedCount = serviceNodeStats.filter((s) => s.status === 'DECOMISSIONED').map((s) => s.count);

  return (
    <>
      <Box>
        <Box direction="row-responsive" pad="small" justify="between">
          {
            serviceNodeStats.map((s) => (
              <StatusLink key={s.status} to={`/status/${s.status.toLowerCase()}`}>
                <Box align="center" justify="center" pad="xsmall" direction="row">
                  <Box align="end" justify="center" pad="xsmall">
                    <Status status={s.status} />
                  </Box>
                  <Box align="start" justify="center" pad="xsmall">
                    <Amount amount={s.count} metric="" />
                  </Box>
                </Box>
              </StatusLink>
            ))
        }
        </Box>
        <Box align="center" justify="center" pad="small" height="small" direction="row-responsive">
          <Logo style={{ width: 200 }} />
          <Heading margin="medium">
              Loki Service Nodes
          </Heading>
          <TextInput
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            onKeyPress={(event) => { if (event.key === 'Enter') { history.push(`/sn/${search}`); } }}
            plain={false}
            type="text"
            placeholder="Service Node Public Key"
          />
          <Button margin="small" label="Find" onClick={() => { history.push(`/sn/${search}`); }} />
        </Box>
      </Box>
      <Box align="center" justify="evenly" pad="small" direction="row-responsive">
        <Box align="center" justify="center" pad="medium" round="small" direction="column">
          <Heading>
            { height && height.height && <Amount amount={height.height} metric="" /> }
          </Heading>
            Current Height
        </Box>
        <Box align="center" justify="center" pad="medium" round="small" direction="column">
          <Heading>
            { stakingRequirement && <Amount amount={stakingRequirement} /> }
          </Heading>
          <Text>
            Staking  Requirement
          </Text>
        </Box>
        <Box align="center" justify="center" pad="medium" round="small" direction="column">
          <Heading>
            { activeNodesNum && <Amount amount={activeNodesNum} metric="" /> }
          </Heading>
          <Text>
            Active Nodes
          </Text>
        </Box>
      </Box>
      <Box align="start" justify="between" direction="row-responsive" pad={{ horizontal: 'medium', vertical: 'xlarge' }}>

        {!loadingAwait && dataAwait && dataAwait.serviceNodes && dataAwait.serviceNodes.length > 0 && (
          <Box>
            <Status status="AWAITING_CONTRIBUTION" style={{ fontSize: '30px', paddingLeft: '15px', paddingRight: '15px' }} />
            <Box pad={{ horizontal: 'small', vertical: 'large' }}>
              {tables.AWAITING_CONTRIBUTION(dataAwait.serviceNodes, 'false')}
            </Box>
            <Box alignSelf="center" style={{ display: 'inline-block' }}>
              {awaitingCount && awaitingCount.length > 0 && awaitingCount[0] > 10 && (
              <Button
                label={`View all awaiting nodes (${awaitingCount[0]})`}
                onClick={() => { history.push('/status/awaiting_contribution'); }}
              />
              )}
            </Box>
          </Box>
        )}
        {!loadingDecom && dataDecom && dataDecom.serviceNodes && dataDecom.serviceNodes.length > 0 && (
          <Box>
            <Status status="DECOMISSIONED" style={{ fontSize: '30px', paddingLeft: '15px', paddingRight: '15px' }} />
            <Box pad={{ horizontal: 'small', vertical: 'large' }}>
              {tables.DECOMISSIONED(dataDecom.serviceNodes, 'true')}
            </Box>
            <Box alignSelf="center" style={{ display: 'inline-block' }}>
              {decomissionedCount && decomissionedCount.length > 0 && decomissionedCount[0] > 10 && (
              <Button
                label={`View all decomissioned nodes (${decomissionedCount[0]})`}
                onClick={() => { history.push('/status/decomissioned'); }}
              />
              )}
            </Box>
          </Box>
        )}
      </Box>
      {!loadingUsers && dataUsers && dataUsers.userStats && dataUsers.userStats.length > 0 && (

      <Box align="center" justify="start" direction="column" pad={{ horizontal: 'medium', bottom: 'medium' }}>
        <Heading level={2}>
            Top contributors
        </Heading>
        <Box pad={{ horizontal: 'small', vertical: 'large' }}>
          {usersTable(dataUsers.userStats, true)}
        </Box>
        <Box alignSelf="center" style={{ display: 'inline-block' }}>
          <Button
            label="View all"
            onClick={() => { history.push('/users/'); }}
          />
        </Box>
      </Box>
      )}
    </>
  );
}

export default Index;
