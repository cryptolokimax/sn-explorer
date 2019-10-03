import React from "react"
import moment from 'moment'
import { Box, Heading, Text, DataTable, Meter, WorldMap } from 'grommet'
import { LinkPrevious, StatusWarning } from 'grommet-icons'
import { useHistory } from "react-router-dom"
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Address, UptimeProof, Height, Amount } from '../components'

import { 
  Contributors,
  DowntimeBlocksChart,
  RewardHistories,
  StatusHistories,
  NextReward,
  VersionHistories,
  PublicIPHistories,
  SwarmHistories
} from '../components/ServiceNode'


import StatsContainer from '../lib/statsContainer'

import constants from '../constants';

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
        height {
          height
          heightDate
        }
      }
    }
  }
`;

const GET_SERVICE_NODE_FREQUENT = gql`
  query ServiceNodeFrequent($publicKey: String!) {
      serviceNode(publicKey: $publicKey) {
        id
        lastUptimeProof
        status
    }
  }
`;

function ServiceNode({ match }) {

  const { params } = match;
  const { publicKey } = params;
  
  const { loading, error, data } = useQuery(GET_SERVICE_NODE, {
    variables: { publicKey },
    pollInterval: 30000
  });

  const { loading: loadingFrequent, error: errorFrequent, data: dataFrequent } = useQuery(GET_SERVICE_NODE_FREQUENT, {
    variables: { publicKey },
    pollInterval: 2000
  });

  const stats = StatsContainer.useContainer()
  const history = useHistory()
  
  if (loading || loadingFrequent) return null;
  if (error || errorFrequent) return `Error! ${error} ${errorFrequent}`;

  const { serviceNode } = data;

  if (!serviceNode) {
    return <Box style={{ margin: 50 }} >
      <Heading>Service Node not found</Heading>
      <Text>{publicKey}</Text>
      <Text>Change your search criteria and try again</Text>
    </Box>
  }
  const { serviceNode: serviceNodeFrequent } = dataFrequent;

  const { 
          requestedUnlockHeight,
          registrationHeight,
          stakingRequirement,
          totalContributed,
          totalReserved,
          operatorFee,
          contributions,
          earnedDowntimeBlocks,
          downtimeBlocksHistories,
          totalReward,
          rewardHistories,
          statusHistories,
          versionHistories,
          publicIPHistories,
          swarmHistories,
          publicIp,
        } = serviceNode;

  const { 
          status,
          lastUptimeProof,
        } = serviceNodeFrequent;

  const decomDowntimeBlocks = 720 - earnedDowntimeBlocks;
  const downtimeDuration = moment.duration((2 * earnedDowntimeBlocks), "minutes")

  const currentVersion = _.get(versionHistories, "[0].version.version");
  const currentVersionGlobal = _.get(stats, "data.generalStatistics.currentVersion.version");

  const currentStakingRequirement = _.get(stats, "data.generalStatistics.currentHeight.stakingRequirement", 0);

  const currentSwarm = _.get(swarmHistories, "[0].swarm.swarmId");
 
  return (
        <>
        <Box align="center" justify="between" direction="row" flex={false}>
          <Box align="center" justify="start" pad="medium" direction="row">
            <LinkPrevious size="large" onClick={() => history.goBack()} style={{cursor: 'pointer'}} /> 
            <Box align="center" justify="stretch" pad="small" flex="grow" direction="row" height="xsmall" margin={{"left":"medium"}}>
                <Address address={publicKey} size="large" />
              <Text color="brand" margin={{"right":"large","left":"large"}}>
                SERVICE NODE
              </Text>
            </Box>
          </Box>
        </Box>
        <Box align="center" justify="start" pad="medium" background={{"color":constants.statusColors[status]}} height="xsmall" direction="row" wrap={false}>
          {constants.statucIcons[status]}

          {
            status === 'UNLOCK_REQUESTED' ? (
              <>
                <Text color="light-1" size="large" margin={{"left":"small"}}>
                  Unlock requested on:
                </Text>
                <Height height={requestedUnlockHeight} color="light-1"/>
              </>
            ) : (
              <Text color="light-1" size="large" margin={{"left":"small"}}>
                {constants.statusTexts[status]}
              </Text>
            )
          }
          <Box align="center" justify="center" pad="small" flex="grow" wrap={false} />
          <UptimeProof lastUptimeProof={lastUptimeProof} full size='large' color='light-1'/>
        </Box>
        <Box align="center" justify="between" pad="small" direction="row" height="small">
          <Box align="center" justify="center" pad="medium" direction="row">
            <Text  size="large" weight="bold">
              Registered on:
            </Text>
            <Height height={registrationHeight} />
          </Box>

          <Box align="end" justify="center" direction="column" style={{ alignSelf: 'flex-end', paddingBottom: '40px'}}>
            <Box align="center" justify="center" pad="small" direction="row">
              <Text  size="large" weight="bold" margin={{"right":"small"}}>
                Staking requirement:
              </Text>
              <Text size="large">
                <Amount amount={stakingRequirement}/><br/>
              </Text>
            </Box>
             <Text size="small">(+ <Amount amount={(stakingRequirement - currentStakingRequirement)}/> to current)</Text>
          </Box>
          <Box align="center" justify="center" pad="small" direction="row">
            <Text  size="large" weight="bold" margin={{"right":"small"}}>
              Operator fee:
            </Text>
            <Text size="large">
              <Amount amount={operatorFee} metric="%"/>
            </Text>
          </Box>
        </Box>
        <Contributors contributions={contributions} totalContributed={totalContributed} stakingRequirement={stakingRequirement} totalReserved={totalReserved} status={status} />

        <Box align="start" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Earned downtime blocks
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <Meter values={[{"color":"accent-1","label":"Earned, blocks","value": earnedDowntimeBlocks},{"color": earnedDowntimeBlocks < 60 ? "status-critical" : "status-unknown","value": decomDowntimeBlocks}]} />
              <Heading size="small" margin={{"left":"medium"}} level="3">
                {(earnedDowntimeBlocks > 0) ? (
                  <span>{earnedDowntimeBlocks} blocks (~ {downtimeDuration.days() ? 24 : downtimeDuration.hours()} hrs {downtimeDuration.minutes()} min)</span>
                ) : <span>0 blocks</span>}
              </Heading>
              <Box align="center" justify="center" pad="large" flex="grow" />
            </Box>
            { earnedDowntimeBlocks < 60 && <Text color="status-critical">60 blocks required to enable deregistration delay</Text>}
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"large"}}>
            {downtimeBlocksHistories.length > 0 && <DowntimeBlocksChart downtimeBlocksHistories = {downtimeBlocksHistories} />}
          </Box>
        </Box>
        <Box align="center" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Reward earned: {<Amount amount={totalReward}/>}
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <RewardHistories rewardHistories={rewardHistories} />
            </Box>
          </Box>
          <NextReward stats={stats} rewardHistories={rewardHistories} />
        </Box>
        <Box align="start" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Box align="start" justify="start" pad="small" direction="column">
              <Heading size="small">
                Status change history
              </Heading>
              <StatusHistories statusHistories={statusHistories}/>
            </Box>
          </Box>
          <Box align="start" justify="center" pad="small" margin={{"left":"large"}}>
            <Box align="center" justify="start" pad="xsmall" direction="row">
              <Box align="start" justify="center" pad="xsmall">
                <Heading size="small">
                  Version: {currentVersion}
                </Heading>
              </Box>
              { (currentVersion !== currentVersionGlobal) ?
                <Box align="center" justify="center" pad="small" direction="row">
                  <StatusWarning color="status-error" />
                  <Heading size="small" margin={{"left":"medium"}} level="3">
                    requires upgrade ({currentVersionGlobal})
                  </Heading>
                </Box> :  
                  <Heading size="small" margin={{"left":"medium"}} level="3">
                    (latest)
                  </Heading>
 
            }
            </Box>
            <Box align="center" justify="center" pad="medium">
              <VersionHistories versionHistories={versionHistories} />
            </Box>
          </Box>
        </Box>
        <Box align="center" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              IP change history
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <PublicIPHistories publicIPHistories={publicIPHistories} />
            </Box>
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"xlarge"}}>
            <WorldMap
              color="light-5"
              onSelectPlace={(lat, lon) => {}}
              places={[
                {
                  name: '',
                  location: [publicIp.latitude, publicIp.longitude],
                  color: 'accent-2',
                  onClick: (name) => {},
                },
              ]}
              selectColor="accent-2"
            />          
          </Box>
        </Box>
        <Box align="center" justify="between" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Swarm ID: {currentSwarm}
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
                <SwarmHistories swarmHistories={swarmHistories} />
            </Box>
          </Box>
        </Box>
        </>
  );
}

export default ServiceNode;