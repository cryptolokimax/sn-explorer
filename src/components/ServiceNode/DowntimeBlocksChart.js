import React, { useState } from 'react';
import {
  Chart, Stack, Box, Text,
} from 'grommet';
import moment from 'moment';
import _ from 'lodash';

import useResponsive from '../../lib/useResponsive';


const DowntimeBlocksChart = ({ downtimeBlocksHistories }) => {
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const r = useResponsive();

  const minBlock = _.minBy(downtimeBlocksHistories, 'earnedDowntimeBlocks');
  const maxBlock = _.maxBy(downtimeBlocksHistories, 'earnedDowntimeBlocks');
  const numOfBlocks = downtimeBlocksHistories.length;
  const chartData = downtimeBlocksHistories.map((d, i) => ({
    value: [(numOfBlocks - i), d.earnedDowntimeBlocks],
    label: d.createdAt,
    onHover: (over) => (over ? setHighlightedBlock(d) : setHighlightedBlock(null)),
  }));
  return (
    <Stack
      anchor="center"
      style={
        r({
          default: { pointerEvents: 'none', marginLeft: '-30px', width: '90vw' },
          medium: { pointerEvents: 'none' },
        })
    }
    >
      <Chart
        type="bar"
        values={chartData}
        thickness="medium"
        overflow={false}
        round={false}
        style={{ pointerEvents: 'auto' }}
        bounds={[[0, (numOfBlocks - 1)], [(minBlock.earnedDowntimeBlocks - 1), maxBlock.earnedDowntimeBlocks]]}
      />
      {highlightedBlock && (
        <Box
          animation={{ type: 'fadeIn', duration: 100 }}
          pad="medium"
          background={{ color: 'white', opacity: 'strong' }}
          border={{ color: 'accent-2' }}
          round
        >
          <Text size="large" weight="bold">
            {highlightedBlock.earnedDowntimeBlocks}
            {' '}
blocks
          </Text>
          <Text>{moment(highlightedBlock.createdAt).format('MMM Do YYYY, h:mm a')}</Text>
        </Box>
      )}
    </Stack>
  );
};

export default DowntimeBlocksChart;
