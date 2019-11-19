import React from 'react';
import moment from 'moment';

import {
  DataTable, Text, Box,
} from 'grommet';
import { gql } from 'apollo-boost';
import {
  Address, Amount, Height,
} from '../../components';

const query = gql`
    query ServiceNodeByStatus($offset: Int, $limit: Int) {
        serviceNodes(status: DECOMISSIONED, offset: $offset, limit: $limit, orderBy: stateHeightHeight, direction: DESC) {
            publicKey
            operatorFee
            stateHeight {
                height
                heightDate
            }
            contributorsNum
            earnedDowntimeBlocks
        }
    }
`;


const table = (serviceNodes) => {
  const snData = serviceNodes.map((s) => ({
    publicKey: s.publicKey,
    operatorFee: s.operatorFee,
    availableForStake: s.availableForStake,
    contributorsNum: s.contributorsNum,
    height: s.stateHeight,
    earnedDowntimeBlocks: s.earnedDowntimeBlocks,
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
          property: 'contributorsNum',
          header: 'Contributors',
          render: (d) => (d.contributorsNum
            && (
            <Amount amount={d.contributorsNum} metric="" />
            )),
        },
        {
          header: 'Last state change on',
          property: 'height',
          render: (d) => (d.height
            && (
            <Height height={d.height} />
            )),
        },
        {
          header: 'Downtime blocks left',
          property: 'earnedDowntimeBlocks',
          render: (d) => {
            if (d.earnedDowntimeBlocks) {
              const downtimeDuration = moment.duration((2 * d.earnedDowntimeBlocks), 'minutes');

              return (
                <Box pad={{ vertical: 'xsmall' }}>
                  <Amount amount={d.earnedDowntimeBlocks} metric="" />
                  <Text size="xsmall" style={{ whiteSpace: 'nowrap' }}>
                            (~
                    {' '}
                    {downtimeDuration.days() ? (24 * downtimeDuration.days() + downtimeDuration.hours()) : downtimeDuration.hours()}
                    {' '}
                            hrs
                    {' '}
                    {downtimeDuration.minutes()}
                    {' '}
                            min)
                  </Text>
                </Box>
              );
            }
            return null;
          },
        },

      ]}
      data={snData}
      resizeable
    />
  );
};

export { query, table };
