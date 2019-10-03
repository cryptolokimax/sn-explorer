import React from "react"
import {  Heading, Box, Text } from 'grommet'
import moment from 'moment'
import _ from 'lodash'

const NextReward = ({ stats, rewardHistories }) => {
    
    
  const currentHeight = _.get(stats, 'data.generalStatistics.currentHeight.height', 0)
  const activeNodesNum = _.get(stats, 'data.generalStatistics.activeNodesNum', 0)
  const lastRewardHeight = rewardHistories.length > 0 ? _.get(rewardHistories[0], 'height.height', 0): 0;

  const blocksToGo = lastRewardHeight - currentHeight + activeNodesNum;
  const nextRewardDuration = moment.duration((2 * blocksToGo), "minutes")

    return (
        (blocksToGo > 0) && <Box align="center" justify="stretch" pad="small" background={{"color":"accent-1"}} round="medium" direction="column" margin={{"left":"large"}}>
            <Heading level="2" margin="small">
            Next reward:
            </Heading>
            <Heading level="2" margin="small">
            ~ in {blocksToGo} block{blocksToGo > 1 ? 's' : ''}
            </Heading>
            <Text>
            ({nextRewardDuration.days() ? 24 : nextRewardDuration.hours()} hrs {nextRewardDuration.minutes()} min)
            </Text>
      </Box>
    );
}
    
export default NextReward;