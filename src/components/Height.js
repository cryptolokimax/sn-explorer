import React from "react"
import moment from 'moment'
import { Box, Text } from 'grommet'
import NumberFormat from 'react-number-format'

const Height = (props) => {

    const { height: heightObject, color = null } = props;

    const { height, heightDate, inFuture } = heightObject;
    return (
        <Box align="center" justify="center" pad="small" direction="row">
            <Box align="center" justify="center" pad="xsmall" border={{"size":"xsmall","style":"solid","color": color || 'accent-1'}} round="small" margin={{"right":"small"}}>
            <Text color={color || 'dark-1'}>
                <NumberFormat value={height} displayType={'text'} thousandSeparator={true} />
            </Text>
            </Box>
            <Text color={color || 'dark-1'}>
            {heightDate && inFuture && '~ '}
            {heightDate && moment(heightDate).format("MMM Do YYYY, h:mm:ss a")}
            </Text>
        </Box>
    );
}
    
export default Height;