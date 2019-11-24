import React from 'react';
import {
  DataTable,
} from 'grommet';
import { gql } from 'apollo-boost';
import {
  Address, Amount, Height,
} from '../../components';

const query = gql`
    query ServiceNodeByStatus($offset: Int, $limit: Int) {
        serviceNodes(status: DEREGISTERED_BY_PENALTY, offset: $offset, limit: $limit, orderBy: stateHeightHeight, direction: DESC) {
            publicKey
            operatorFee
            stateHeight {
                height
                heightDate
            }
            contributorsNum
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

      ]}
      data={snData}
      resizeable
    />
  );
};

export { query, table };
