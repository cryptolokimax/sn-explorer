import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import useResponsive from '../lib/useResponsive';

const Header = ({ value, title }) => {
  const history = useHistory();
  const r = useResponsive();

  return (
    <Box align="center" justify="between" direction="row" flex={false}>
      <Box align="center" justify="start" pad="medium" direction="row">
        <LinkPrevious size="large" onClick={() => history.goBack()} style={{ cursor: 'pointer' }} />
        <Box
          align={r({ default: 'left', medium: 'center' })}
          justify="stretch"
          pad="small"
          flex="grow"
          direction={r({ default: 'column-reverse', medium: 'row' })}
          height={r({ default: '160px', medium: 'xsmall' })}
          margin={{ left: 'medium' }}
        >
          {value}
          <Text
            size="medium"
            color="brand"
            margin={r({ default: {}, medium: { right: 'large', left: 'large' } })}
          >
            {title}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
