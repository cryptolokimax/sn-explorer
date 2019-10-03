import React, { useState, useEffect } from "react"
import moment from 'moment'
import { Box, Text } from 'grommet'
import { Alert } from 'grommet-icons'

const timeString = (value, metric) => (value ? `${value} ${metric}${value > 1 ? '' : ''} `: '')

const UptimeProof = ({ lastUptimeProof, full = false, size = 'medium', color }) => {

    const lastProofMomentInitial = moment.duration(moment().diff(moment(lastUptimeProof)));
    const [lastProof, setLastProof] = useState(lastProofMomentInitial);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const lastProofMomentNew = moment.duration(moment().diff(moment(lastUptimeProof)));
            setLastProof(lastProofMomentNew);
        }, 1000);    
        return () => clearInterval(intervalId);
      }, [lastProof, lastUptimeProof]);

    const [seconds, minutes, hours, days, months, years] = [lastProof.seconds(), lastProof.minutes(), lastProof.hours(), lastProof.days(), lastProof.months(), lastProof.years()];
    const lastProofString = `${timeString(years, 'year')}${timeString(months, 'month')}${timeString(days, 'day')}${timeString(hours, 'hr')}${timeString(minutes, 'min')}${timeString(seconds, 'sec')}`;
    const showWarning = lastProof.asMinutes() > 90; // Display is more than 90 minutes passed since uptime proof
    return lastProofString && (
        <Box direction="row" margin={{"right":"small","left":"small"}}>
            {showWarning && <Box margin={{"right":"small","left":"small"}}><Alert color="accent-4"/></Box>}
            {full && <Text size={ size } color={ color }>Last uptime proof:&nbsp;</Text>}
            <Text size={ size } color={ color } style={{minWidth: 230}}>
                {lastProofString}
                ago
            </Text>
        </Box>
    );
}
    
export default UptimeProof;