import React from 'react';
import {
  DataTable, Box, Meter, Text,
} from 'grommet';
import { gql } from 'apollo-boost';
import pluralize from 'pluralize';
import {
  Address, Amount,
} from '../../components';

const query = gql`
    query ServiceNodeByStatus($offset: Int, $limit: Int) {
        serviceNodes(status: AWAITING_CONTRIBUTION, offset: $offset, limit: $limit, orderBy: availableForStake, direction: ASC) {
            publicKey
            active
            status 
            operatorFee
            stakingRequirement
            availableForStake
            contributorsNum
        }
    }
`;


const table = (serviceNodes) => {
  const snData = serviceNodes.map((s) => ({
    publicKey: s.publicKey,
    stakingRequirement: s.stakingRequirement,
    operatorFee: s.operatorFee,
    availableForStake: s.availableForStake,
    staked: (s.stakingRequirement - s.availableForStake),
    percent: (s.stakingRequirement - s.availableForStake) / s.stakingRequirement * 100,
    contributorsNum: s.contributorsNum,
    availableContributorsNum: (4 - s.contributorsNum),
    minStakingAmount: s.availableForStake / (4 - s.contributorsNum),
  }));

  return (
    <DataTable
      columns={[
        {
          header: 'Service Node', property: 'publicKey', align: 'start', render: (d) => (d.publicKey && <Address address={d.publicKey} />),
        },
        {
          header: 'Operator Fee',
          property: 'operatorFee',
          render: (d) => (d.operatorFee
                && (
                <Amount amount={d.operatorFee} metric="%" />
                )),
        },
        {
          property: 'percent',
          header: 'Staked',
          render: (d) => (
            <Box pad={{ vertical: 'xsmall' }}>
              <Meter
                values={[{ value: d.percent }]}
                thickness="small"
                size="small"
              />
              <Text size="xsmall">
                <Amount amount={d.staked} metric="" />
                {' '}
              of
                {' '}
                <Amount amount={d.stakingRequirement} />
                {' '}
              (
                <Amount amount={d.percent} metric="%" />
              )
              </Text>
            </Box>
          ),
        },
        {
          header: 'Available for stake',
          property: 'availableForStake',
          render: (d) => (d.availableForStake
            && (
            <Box pad={{ vertical: 'xsmall' }}>
              <Amount amount={d.availableForStake} />
              <Text size="xsmall">
                {d.availableContributorsNum}
                {' '}
                of 4
                {' '}
                {pluralize('slot', d.availableContributorsNum)}
                {' '}
                available
              </Text>
            </Box>
            )),
        },
        {
          header: 'Min. contribution',
          property: 'minStakingAmount',
          render: (d) => (d.minStakingAmount
              && (
              <Amount amount={d.minStakingAmount} />
              )),
        },
      ]}
      data={snData}
      resizeable
    />
  );
};

export { query, table };
