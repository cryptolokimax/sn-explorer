const calcMinimumContribution = (
  availableForStake,
  contributorsNum,
  maxNumOfContributions
) => {
  const minStakingAmount =
    availableForStake / (maxNumOfContributions - contributorsNum);
  return minStakingAmount;
};

export default calcMinimumContribution;
