import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { LinkPrevious } from 'grommet-icons';
import useResponsive from '../lib/useResponsive';
import Logo from './Logo';

const Header = ({ value, title }) => {
  const history = useHistory();
  const r = useResponsive();

  return (
    <Box align="center" justify="between" direction="row" flex={false}>
      <Box align="center" justify="start" pad={r({ default: 'xsmall', medium: 'medium' })} direction="row">
        {r({ default: null, medium: (<LinkPrevious size="large" onClick={() => history.goBack()} style={{ cursor: 'pointer' }} />) })}

        <Link to="/"><Logo style={r({ default: {width: 60, height: 60}, medium: { width: 100, height: 100 }})} /></Link>
        <Box
          align={r({ default: 'left', medium: 'center' })}
          justify="stretch"
          pad="small"
          flex="grow"
          direction={r({ default: 'column-reverse', medium: 'row' })}
          height={r({ default: 'auto', medium: 'xsmall' })}
          margin={{ left: r({ default: 'xsmall', medium: 'medium' }) }}
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
