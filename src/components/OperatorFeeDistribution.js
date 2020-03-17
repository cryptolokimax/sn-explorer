import React, { useState } from 'react';
import {
  Box, Chart, Text, Stack,
} from 'grommet';
import styled from 'styled-components';
import _ from 'lodash';

import useResponsive from '../lib/useResponsive';

const BoxNoPointer = styled(Box)`
    pointer-events: none;
`;

const LabelledChart = ({
  maxFreq, label, value, onHover,
}) => (
  <Box flex={false}>
    <Chart
      type="bar"
      bounds={[
        [0, 2],
        [0, maxFreq],
      ]}
      values={[{ value: [1, value], onHover: (over) => (over ? onHover(label, value) : onHover(null, null)) }]}
      round
      gap="xxsmall"
      size={{
        height: 'medium', width: '20px',
      }}
    />
    <Box align="center">
      <div style={{
        transform: 'rotate(-55deg)', paddingTop: '5px', position: 'relative', left: '-3px',
      }}
      >
        <Text>
          {label}
        %
        </Text>
      </div>
    </Box>
  </Box>
);

const OperatorFeeDistribution = ({ feeHistogram }) => {
  const [highlightedBlock, setHighlightedBlock] = useState(null);
  const r = useResponsive();

  const minClass = _.minBy(feeHistogram, (o) => o.class).class;
  const maxClass = _.maxBy(feeHistogram, (o) => o.class).class;
  const totalElements = feeHistogram.reduce((a, c) => (a + c.frequency), 0);
  const maxFreq = (_.maxBy(feeHistogram, (o) => o.frequency).frequency / totalElements) * 100;

  const classRange = _.range(minClass, (maxClass + 1));

  // We will detect outliers in a simple way: find 3 empty classes in a row after 20% and combine them
  const outliers = classRange.reduce(
    (a, c) => {
      if (c > 20) {
        const freqObj = _.find(feeHistogram, { class: c });
        const frequency = freqObj ? freqObj.frequency : 0;
        if (frequency === 0) return { ...a, inARowCount: a.inARowCount + 1 };
        if (a.inARowCount < 3) return { start: (c + 1), frequency: 0, inARowCount: 0 };
        return { ...a, frequency: a.frequency + frequency, inARowCount: a.inARowCount + 1 };
      }
      return a;
    },
    { start: 101, frequency: 0, inARowCount: 0 },
  );

  const outlierPercentage = (outliers.frequency / totalElements) * 100;

  return (
    <Stack
      anchor="center"
    >
      <Box direction="row">
        {
          // do not display  classes ater outlier threshold
          classRange.filter((a) => a <= outliers.start).map(
            (c) => {
              const freqObj = _.find(feeHistogram, { class: c });
              const frequency = freqObj ? freqObj.frequency : 0;
              const percentage = (frequency / totalElements) * 100;
              return (
                <LabelledChart
                  onHover={(l, v) => setHighlightedBlock({ label: l, value: v })}
                  key={c}
                  maxFreq={maxFreq}
                  label={c === outliers.start ? `> ${(c - 1)}` : c}
                  value={c === outliers.start ? outlierPercentage : percentage}
                />
              );
            },
          )
        }
      </Box>
      {highlightedBlock && highlightedBlock.label !== null && (
        <BoxNoPointer
          animation={{ type: 'fadeIn', duration: 100 }}
          pad="medium"
          background={{ color: 'white', opacity: 'strong' }}
          border={{ color: 'accent-2' }}
          round
        >
          <Text size="large" weight="bold">
            {Math.round(highlightedBlock.value * 100) / 100}
            {' '}
            %
          </Text>
          <Text size="small">
            of Service Nodes
            <br />
            have
            {' '}
            {highlightedBlock.label}
            % operator fee
          </Text>
        </BoxNoPointer>
      )}
    </Stack>
  );
};

export default OperatorFeeDistribution;
