import React from "react"
import {  Heading, Box, Text } from 'grommet'
import moment from 'moment'
import pluralize from 'pluralize'
import _ from 'lodash'

const NextReward = ({ stats, lastRewardBlockHeight, rewardHistories }) => {
    
  const currentHeight = _.get(stats, 'data.generalStatistics.currentHeight.height', 0)
  const activeNodesNum = _.get(stats, 'data.generalStatistics.activeNodesNum', 0)
  // const lastRewardHeight = rewardHistories.length > 0 ? _.get(rewardHistories[0], 'height.height', 0): 0;
  const lastRewardHeight = lastRewardBlockHeight.height;

  const blocksToGo = lastRewardHeight - currentHeight + activeNodesNum;
  const nextRewardDuration = moment.duration((2 * blocksToGo), "minutes")

  // console.log('lastRewardHeight', lastRewardHeight);
  // console.log('currentHeight', currentHeight);
  // console.log('activeNodesNum', activeNodesNum);
  // console.log('blocksToGo', blocksToGo);
  // console.log('nextRewardDuration', nextRewardDuration);

    return (
        (blocksToGo > 0) && <Box align="center" justify="stretch" pad="small" background={{"color":"accent-1"}} round="medium" direction="column" margin={{"left":"large"}}>
            <Heading level="2" margin="small">
            Next reward:
            </Heading>
            <Heading level="2" margin="small">
            ~ in {blocksToGo} {pluralize('block', blocksToGo)}
            </Heading>
            <Text>
              {moment().add(nextRewardDuration).format("MMM Do YYYY, h:mm a")}
            </Text>
            <Text>
              (in {nextRewardDuration.days() ? ((nextRewardDuration.days() * 24) + nextRewardDuration.hours()) : nextRewardDuration.hours()} hrs {nextRewardDuration.minutes()} min)
            </Text>
      </Box>
    );
}
    
export default NextReward;