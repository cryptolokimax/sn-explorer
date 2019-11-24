import React from 'react';
import {
  Heading,
  Box,
} from 'grommet';

import { useQuery } from '@apollo/react-hooks';

// import useResponsive from '../lib/useResponsive';
import {
  Header, Pager,
} from '../components';

import { query, table } from '../tables/users';

const resultsPerPage = 20;

function Users({ match }) {
  // const r = useResponsive();

  const { params } = match;
  const { pageParam } = params;
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const offset = (page - 1) * resultsPerPage;

  const { loading, error, data } = useQuery(query, {
    variables: { offset, limit: resultsPerPage },
  });


  if (loading) return null;
  if (error) return `Error! ${error}`;

  const { userStats } = data;


  return (
    <>
      <Header
        value={<Heading>Top contributors</Heading>}
      />
      <Box align="center" justify="center" pad="small">
        {table(userStats)}
      </Box>

      <Pager page={page} url="/users/" />
    </>
  );
}

export default Users;
