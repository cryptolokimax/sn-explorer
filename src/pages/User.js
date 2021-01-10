import React from "react";
import { Box, DataTable } from "grommet";
import { useQuery } from "@apollo/client";
import { gql } from "apollo-boost";
import { Header, Address, Status, Amount } from "../components";

const GET_USER = gql`
  query User($address: String!) {
    user(address: $address) {
      address
      contributions {
        amount
        percent
        isOperator
        serviceNode {
          publicKey
          status
        }
      }
    }
  }
`;

function User({ match }) {
  const { params } = match;
  const { address } = params;

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { address },
  });

  if (loading) return null;
  if (error) return `Error! ${error}`;

  const { user } = data;

  const { contributions } = user;

  const snData = contributions.map((s) => ({
    amount: s.amount,
    percent: s.percent,
    isOperator: s.isOperator,
    publicKey: s.serviceNode.publicKey,
    status: s.serviceNode.status,
  }));

  return (
    <>
      <Header
        value={<Address address={address} size="large" type="user" />}
        title="OPERATOR / CONTRIBUTOR"
      />
      <Box align="center" justify="center" pad="small">
        <DataTable
          columns={[
            {
              header: "Service Node",
              property: "publicKey",
              align: "start",
              render: (d) => d.publicKey && <Address address={d.publicKey} />,
            },
            {
              header: "Status",
              property: "status",
              search: true,
              render: (d) => d.status && <Status status={d.status} />,
            },
            {
              header: "Contributed",
              property: "amount",
              sortable: true,
              render: (d) =>
                d.amount && (
                  <div>
                    <Amount amount={d.amount} /> (
                    <Amount amount={d.percent} metric="%" />)
                  </div>
                ),
            },
            {
              header: "",
              property: "isOperator",
              render: (d) => d.isOperator && "Operator",
            },
          ]}
          data={snData}
          resizeable
        />
      </Box>
    </>
  );
}

export default User;
