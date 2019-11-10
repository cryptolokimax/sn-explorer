import React from 'react';
import { DataTable } from 'grommet';
import moment from 'moment';
import { Height, Status } from '..';

const PublicIPHistories = ({ publicIPHistories }) => {
  const publicIPData = publicIPHistories.map((r) => ({
    date: moment(r.createdAt).format('MMM Do YYYY, h:mm:ss\xa0a'),
  }));
  return (
    <DataTable
      columns={[
        { header: 'Date', property: 'date', primary: true },
      ]}
      data={publicIPData}
    />
  );
};

export default PublicIPHistories;
