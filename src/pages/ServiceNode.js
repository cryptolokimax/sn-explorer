import React from "react";
import { Box, Heading, Text, Clock, DataTable, Stack, Meter, Chart } from 'grommet'
import { LinkPrevious, Copy, Clock as ClockIcon, Alert, StatusWarning } from 'grommet-icons'

import { Address } from '../components'

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';


const GET_SERVICE_NODE = gql`
  query ServiceNode($publicKey: String!) {
    serviceNode(publicKey: $publicKey) {
      id
      publicKey
      active
      earnedDowntimeBlocks 
      decomissionCount
      funded
      status
      lastUptimeProof
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
        ip
      }
      swarm {
        swarmId
      }
      version {
        version
      }
      contributions {
        amount
        percent
        isOperator
      }
    }
  }
`;

function ServiceNode({ match }) {
  const { params } = match;
  const { publicKey } = params;

  const { loading, error, data } = useQuery(GET_SERVICE_NODE, {
    variables: { publicKey },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  const { serviceNode } = data;

  return (
        <>
        <Box align="center" justify="between" direction="row" flex={false}>
          <Box align="center" justify="start" pad="small" direction="row">
            <LinkPrevious size="large" />
            <Box align="center" justify="stretch" pad="small" flex="grow" direction="row" height="xsmall" margin={{"left":"medium"}}>
              <Heading margin={{"right":"medium"}}>
                <Address address={serviceNode.publicKey} />
              </Heading>
              <Copy size="large" />
              <Text color="brand" margin={{"right":"medium","left":"medium"}}>
                SERVICE NODE
              </Text>
            </Box>
          </Box>
        </Box>
        <Box align="center" justify="start" pad="large" background={{"color":"status-warning"}} height="xxsmall" direction="row" wrap={false}>
          <ClockIcon color="light-1" />
          <Text color="light-1" size="large" margin={{"left":"small"}}>
            Unlock requested on:
          </Text>
          <Box align="center" justify="center" pad="small" direction="row">
            <Box align="center" justify="center" pad="xsmall" border={{"size":"xsmall","style":"solid","color":"dark-1"}} round="small" margin={{"right":"small"}}>
              <Text color="black">
                34511
              </Text>
            </Box>
            <Text color="light-1">
              Dec, 10 2018, 05:50:12
            </Text>
          </Box>
          <Box align="center" justify="center" pad="small" flex="grow" wrap={false} />
          <Alert color="accent-4" />
          <Text size="large" color="light-1" margin={{"right":"small","left":"small"}}>
            Last uptime proof: 
          </Text>
          <Clock type="digital" size="large" />
          <Text size="large" color="light-1" margin={{"left":"small"}}>
            ago
          </Text>
        </Box>
        <Box align="center" justify="between" pad="small" direction="row" height="xsmall">
          <Box align="center" justify="center" pad="small" direction="row">
            <Text weight="bold" margin={{"right":"small"}}>
              Registered on:
            </Text>
            <Box align="center" justify="center" pad="xsmall" border={{"size":"xsmall","style":"solid","color":"accent-1"}} round="small" margin={{"right":"small"}}>
              <Text>
                34511
              </Text>
            </Box>
            <Text>
              Dec, 10 2018, 05:50:12
            </Text>
          </Box>
          <Box align="center" justify="center" pad="small" direction="row">
            <Text weight="bold" margin={{"right":"small"}}>
              Staking requirement:
            </Text>
            <Text size="large">
              21,645.33 LOKI
            </Text>
          </Box>
          <Box align="center" justify="center" pad="small" direction="row">
            <Text weight="bold" margin={{"right":"small"}}>
              Operator fee:
            </Text>
            <Text size="large">
              24.77%
            </Text>
          </Box>
        </Box>
        <Box align="start" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small" margin={{"bottom":"large"}}>
              Contributors
            </Heading>
            <Box align="center" justify="center" pad="small">
              <DataTable columns={[{"header":"Public Key","property":"publicKey","primary":true},{"property":"amount","header":"Amount","sortable":true,"aggregate":"sum","footer":{"aggregate":true}},{"header":"%","property":"percent","sortable":false,"aggregate":"sum","footer":{"aggregate":true}},{"property":"isOperator"}]} data={[{"publicKey":"c4c116c...59206e","amount":103434.33,"percent":78,"isOperator":" Operator"},{"publicKey":"c4c116c...59206e","amount":2664.33,"percent":12},{"publicKey":"c4c116c...59206e","amount":1004.33,"percent":10}]} />
            </Box>
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"xlarge"}}>
            <Stack anchor="center">
              <Meter values={[{"color":"accent-1","label":"c4c116c...59206e","value":78,"highlight":false},{"color":"accent-2","label":"c4c116c...59206e","value":12},{"color":"accent-3","label":"c4c116c...59206e","value":5},{"value":10,"color":"status-unknown"}]} round={false} type="circle" />
              <Box align="center" justify="center" pad="small">
                <Heading truncate={false} size="small" textAlign="center">
                  14,534  LOKI (12.5%)
                </Heading>
                <Text textAlign="center">
                  available for contribution
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box align="start" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Earned downtime blocks
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <Meter values={[{"color":"accent-1","label":"Earned, blocks","value":600},{"color":"status-unknown","value":120}]} />
              <Heading size="small" margin={{"left":"medium"}} level="3">
                600 blocks (~ 20 hrs 15 min)
              </Heading>
              <Box align="center" justify="center" pad="large" flex="grow" />
            </Box>
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"large"}}>
            <Chart type="bar" values={[{"value":[0,720],"label":"Dec, 10, 2018 05:50:12"},{"value":[1,700],"label":"Dec, 10, 2018 05:50:12"},{"value":[2,700],"label":"Dec, 10, 2018 05:50:12"},{"value":[3,680],"label":"Dec, 10, 2018 05:50:12"}]} thickness="medium" overflow={false} round={false} />
          </Box>
        </Box>
        <Box align="center" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Reward earned: 234,344.333 LOKI
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <DataTable columns={[{"header":"Height","property":"height","primary":true},{"header":"Reward","property":"reward"}]} data={[{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555}]} />
            </Box>
          </Box>
          <Box align="center" justify="stretch" pad="small" background={{"color":"accent-1"}} round="medium" direction="column" margin={{"left":"large"}}>
            <Heading level="2" margin="small">
              Next reward:
            </Heading>
            <Heading level="2" margin="small">
              ~ in 350 blocks
            </Heading>
            <Text>
              (in 3 hrs 20 min)
            </Text>
          </Box>
        </Box>
        <Box align="start" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Box align="start" justify="start" pad="small" direction="column">
              <Heading size="small">
                Status change history
              </Heading>
              <DataTable columns={[{"header":"Height","property":"height","primary":true},{"property":"date","header":"Date"},{"header":"Status","property":"status"}]} data={[{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555}]} />
            </Box>
          </Box>
          <Box align="start" justify="center" pad="small" margin={{"left":"large"}}>
            <Box align="center" justify="start" pad="xsmall" direction="row">
              <Box align="start" justify="center" pad="xsmall">
                <Heading size="small">
                  Version: 4.0.5
                </Heading>
              </Box>
              <Box align="center" justify="center" pad="small" direction="row">
                <StatusWarning color="status-error" />
                <Heading size="small" margin={{"left":"medium"}} level="3">
                  requires upgrade
                </Heading>
              </Box>
            </Box>
            <Box align="center" justify="center" pad="medium">
              <DataTable columns={[{"header":"Date","property":"date","primary":true},{"header":"Version","property":"version"}]} data={[{"date":"Dec, 10 2018, 05:50:12","version":"4.0.5"},{"date":"Dec, 10 2018, 05:50:12","version":"4.0.3"}]} />
            </Box>
          </Box>
        </Box>
        <Box align="center" justify="start" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              IP change history
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <DataTable columns={[{"header":"Date","property":"date","primary":true}]} data={[{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555},{"height":"368,344 Dec, 10 2018, 05:50:12","reward":53.555}]} />
            </Box>
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"xlarge"}}>
            <Box align="center" justify="center" pad="small" background={{"color":"accent-1"}} width="medium" height="medium" />
          </Box>
        </Box>
        <Box align="center" justify="between" pad="small" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small">
              Swarm ID: 13546827679130452000
            </Heading>
            <Box align="center" justify="start" pad="small" direction="row">
              <DataTable columns={[{"header":"Date","property":"date","primary":true},{"property":"swarmId","header":"Swarm ID"}]} data={[{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"},{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"},{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"},{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"},{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"},{"date":"368,344 Dec, 10 2018, 05:50:12","swarmId":"13546827679130452000"}]} />
            </Box>
          </Box>
        </Box>
        </>
  );
}

export default ServiceNode;