import React from "react"
import { useHistory } from "react-router-dom"
import { Box, Heading, Text, DataTable, Button } from 'grommet'
import { LinkPrevious, LinkNext } from 'grommet-icons'
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Height, Amount, Status, Address } from '../components'

const GET_SERVICE_NODE_BY_STATUS = gql`
  query ServiceNodeByStatus($status: Status!, $offset: Int, $limit: Int) {
      serviceNodes(status: $status, offset: $offset, limit: $limit) {
      id
      publicKey
      active
      status 
      operatorFee
      registrationHeight {
        height
        heightDate
      }
      lastRewardBlockHeight {
        height
        heightDate
        rewardToSn
      }
    }
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

const resultsPerPage = 10;

function StatusPage({ match }) {
    
    const { params } = match;
    const { statParam, pageParam } = params;
    const status = statParam.toUpperCase();;
    
    const page = pageParam ? parseInt(pageParam) : 1;

    const offset = (page - 1) * resultsPerPage;

    const history = useHistory()

    const { loading, error, data } = useQuery(GET_SERVICE_NODE_BY_STATUS, {
        variables: { status, offset, limit: resultsPerPage }
    });

    const { loading: loadingStats, error: errorStats, data: dataStats } = useQuery(GET_SERVICE_NODE_STATS);

    if (loading || loadingStats) return null;
    if (error || errorStats) return `Error! ${error} ${errorStats}`;

    const { serviceNodes } = data;
    const { serviceNodeStats } = dataStats;
 
    const numOfResultsArr = serviceNodeStats.filter(s=> s.status === status);
    const numOfResults = numOfResultsArr[0].count;
    const numOfPages = Math.ceil(numOfResults / resultsPerPage);

    if (!serviceNodes) {
        return <Box style={{ margin: 50 }} >
        <Heading>Service Nodes not found</Heading>
        <Text>{status}</Text>
        <Text>Change your search criteria and try again</Text>
        </Box>
    }

     const snData = serviceNodes.map( s => ({
        publicKey: s.publicKey,
        status: s.status,
        reward_height: s.lastRewardBlockHeight,
        rewardToSn: s.lastRewardBlockHeight.rewardToSn,
    }))

    return(
        <>
        <Box align="center" justify="between" direction="row" flex={false}>
            <Box align="center" justify="start" pad="medium" direction="row">
                <LinkPrevious size="large" onClick={() => history.push("/")} style={{cursor: 'pointer'}} /> 
                <Box align="center" justify="stretch" pad="small" flex="grow" direction="row" height="xsmall" margin={{"left":"medium"}}>
                     <Status status={status} style={{ fontSize: '55px', paddingLeft: '15px', paddingRight: '15px' }}/> <Text style={{ fontSize: '55px' }}>service nodes</Text>
                </Box>
            </Box>
        </Box>

        <Box align="center" justify="center" pad="small">
            <DataTable 
                columns={[
                    {"header":"Service Node","property":"publicKey","search":true,"align":"start", render: d =>  (d.publicKey && <Address address={d.publicKey} />)},
                    {"header":"Status","property":"status","search":true,"sortable":true, render: d =>  (d.status && <Status status={d.status} />)},
                    {"header":"Last Reward Height","property":"reward_height", render: d =>  (d.reward_height && d.status !== 'AWAITING_CONTRIBUTION' && <Height height={d.reward_height} />)},
                    {"property":"rewardToSn","header":"Last Reward Amount", render: d =>  (d.rewardToSn && d.status !== 'AWAITING_CONTRIBUTION' && <Amount amount={d.rewardToSn} />)}
                ]} 
                data={snData}
                resizeable={true}
            />
        </Box>

        <Box align="center" justify="center" pad="large" direction="row">
                <Button
                    icon={<LinkPrevious />}
                    label="Previous"
                    onClick={() => { history.push(`/status/${statParam}/${page - 1}`) }}
                    disabled={page === 1}
                />
                <Text style={{ paddingLeft: 15, paddingRight: 15}}>{page} of {numOfPages}</Text>
                <Button
                    icon={<LinkNext />}
                    label="Next"
                    onClick={() => { history.push(`/status/${statParam}/${page + 1}`) }}
                    disabled={page === numOfPages}
                />
        </Box>

        </>
    )
}

export default StatusPage