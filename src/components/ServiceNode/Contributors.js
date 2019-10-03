import React, { useState } from "react"
import { Box, Heading, Text, DataTable, Stack, Meter } from 'grommet'
import { Address, Amount } from '../'
import _ from 'lodash'

const Contributors = ({ contributions, totalContributed, stakingRequirement, totalReserved }) => {

  const [highlightPublicKey, setHighlightPublicKey] = useState('');

  const contributorData = _.sortBy(_.uniqBy(contributions, c => c.contributor ? c.contributor.address : ''), c => !c.isOperator).map(c => ({
    publicKey: _.get(c, 'contributor.address', ''),
    amount: c.amount,
    percent: c.percent,
    isOperator: c.isOperator ? 'Operator' : '',
  }));

  const contributorHighlighted = contributorData.map(c => c.publicKey === highlightPublicKey ? 'light-1' : '')

  const contributorGraphData = contributorData.map(c => ({
    label: c.publicKey,
    value: c.percent,
    highlight: c.publicKey === highlightPublicKey,
    onHover: over => setHighlightPublicKey(over ? c.publicKey : '')
  }))

  if (totalContributed < stakingRequirement) contributorGraphData.push({
    label: 'not contributed',
    value: ((stakingRequirement - totalContributed) / totalContributed * 100),
    color: 'light-1'
  })

    return (
        <Box align="center" justify="start" pad="medium" direction="row">
          <Box align="start" justify="center" pad="small">
            <Heading size="small" margin={{"bottom":"large"}}>
              Contributors
            </Heading>
            <Box align="center" justify="center" pad="small">
              <DataTable
                columns={[
                  {"header":"Contributor address","property":"publicKey","primary":true, render: d =>  (d.publicKey && <Address address={d.publicKey} type="user" />) },
                  {"property":"amount","header":"Amount","sortable":true,"aggregate":"sum","footer":{"aggregate":true}, render: d =>  (d.amount && <Amount amount={d.amount} />) },
                  {"header":"%","property":"percent","sortable":false,"aggregate":"sum","footer":{"aggregate":true}, render: d =>  (d.percent && <Amount amount={d.percent} metric="%" />)},
                  {"property":"isOperator"}
                ]} 
                data={contributorData}
                background={contributorHighlighted}
              />
            </Box>
          </Box>
          <Box align="center" justify="center" pad="small" margin={{"left":"xlarge"}}>
            <Stack anchor="center">
              <Meter values={contributorGraphData} round={false} type="circle" />
              <Box align="center" justify="center" pad="small">
                {
                  (stakingRequirement === totalContributed &&  totalContributed === totalReserved) ? (
                    <><Heading truncate={false} size="small" textAlign="center">100%</Heading>
                    <Text textAlign="center">staked</Text></>
                  ):(
                     <><Heading truncate={false} size="small" textAlign="center"><Amount amount={(stakingRequirement - totalReserved)}/> (<Amount amount={(stakingRequirement - totalReserved) / stakingRequirement * 100} metric="%"/>)</Heading>
                    <Text textAlign="center">available for contribution</Text></>
                  )
                }
              </Box>
            </Stack>
          </Box>
        </Box>
    );
}
    
export default Contributors;