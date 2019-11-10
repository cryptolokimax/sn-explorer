import React from 'react';
import { Box, Text } from 'grommet';
import constants from '../constants';

const Status = ({ status, ...rest }) => (
  <Box direction="row">
    {constants.statusIconsColored[status]}
    <Text style={{ paddingLeft: '10px' }} {...rest} color={constants.statusColors[status]}>{constants.statusTexts[status]}</Text>
  </Box>
);

export default Status;
