import React from 'react';
import {
  DataTable,
} from 'grommet';
import { gql } from 'apollo-boost';
import {
  Address, Amount, Height,
} from '../components';

const query = gql`
    query UserStats($offset: Int, $limit: Int) {
        userStats(offset: $offset, limit: $limit) {
            user {
                address
            }
            nodesCount
            totalContributed
        }
    }
`;


const table = (users) => {
  const snData = users.map((s) => ({
    address: s.user.address,
    nodesCount: s.nodesCount,
    totalContributed: s.totalContributed,
  }));

  return (
    <DataTable
      columns={[
        {
          header: 'User', property: 'address', align: 'start', render: (d) => (d.address && <Address address={d.address} type="user" />),
        },
        {
          header: 'Num of nodes',
          property: 'nodesCount',
          render: (d) => (d.nodesCount
                && (
                <Amount amount={d.nodesCount} metric="" />
                )),
        },
        {
          property: 'totalContributed',
          header: 'Contributed',
          render: (d) => (d.totalContributed
            && (
            <Amount amount={d.totalContributed} />
            )),
        },
      ]}
      data={snData}
      resizeable
    />
  );
};

export { query, table };
