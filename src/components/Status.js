import React from "react"
import constants from '../constants'
import { Box, Text  } from 'grommet'

const Status = ({ status, ...rest }) => {
    return (
        <Box direction="row" >
            {constants.statusIconsColored[status]}
            <Text style={{ paddingLeft: '10px' }} {...rest}  color={ constants.statusColors[status] }>{constants.statusTexts[status]}</Text>
        </Box>
    );
}
    
export default Status;