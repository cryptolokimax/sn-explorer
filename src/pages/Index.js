import React, { useState } from 'react';
import {
  Box, Heading, TextInput, Text,
} from 'grommet';
import _ from 'lodash';
import { Link, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import styled from 'styled-components';

import {
  Height, Amount, Logo, Status,
} from '../components';

import StatsContainer from '../lib/statsContainer';

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

  if (loading) return null;
  if (error) return `Error! ${error}`;

  const { serviceNodeStats } = data;

  return (
    <>
      <Box align="center" justify="center" pad="small" height="small" direction="row">
        <Logo style={{ width: 200 }} />
        <Heading margin="medium">
            Loki Service Nodes
        </Heading>
        <TextInput onChange={(e) => setSearch(e.target.value)} value={search} onKeyPress={(event) => { if (event.key === 'Enter') { history.push(`/sn/${search}`); } }} plain={false} type="text" placeholder="Service Node Public Key" />
      </Box>
      <Box align="center" justify="evenly" pad="small" height="medium" background={{ color: 'accent-1' }} direction="row">
        <Box align="center" justify="center" pad="medium" round="small" border={{ color: 'black', size: 'xsmall' }} background={{ color: 'accent-1' }}>
          <Heading>
                Height:
          </Heading>
          { height && <Height height={height} /> }
        </Box>
        <Box align="center" justify="center" pad="medium" round="small" border={{ color: 'black', size: 'xsmall' }} background={{ color: 'accent-1' }}>
          <Heading>
                Staking  Requirement:
          </Heading>
          <Text>
            { stakingRequirement && <Amount amount={stakingRequirement} /> }
          </Text>
        </Box>
        <Box align="center" justify="center" pad="medium" round="small" border={{ color: 'black', size: 'xsmall' }} background={{ color: 'accent-1' }}>
          <Heading>
                Active Nodes:
          </Heading>
          <Text>
            { activeNodesNum && <Amount amount={activeNodesNum} metric="" /> }
          </Text>
        </Box>
      </Box>
      <Box align="start" justify="center" pad="medium">
        <Heading level="2">
            Service Nodes by Status:
        </Heading>

        {
            serviceNodeStats.map((s) => (
              <StatusLink key={s.status} to={`/status/${s.status.toLowerCase()}`}>
                <Box align="center" justify="center" pad="xsmall" direction="row">
                  <Box align="end" justify="center" pad="xsmall" width="large">
                    <Heading level="2">
                      <Status status={s.status} style={{ fontSize: '35px', paddingLeft: '15px', paddingRight: '15px' }} />
                    </Heading>
                  </Box>
                  <Box align="start" justify="center" pad="xsmall" width="medium">
                    <Heading level="2">
                      <Amount amount={s.count} metric="" />
                    </Heading>
                  </Box>
                </Box>
              </StatusLink>
            ))
        }
      </Box>
    </>
  );
}

export default Index;
