const calcMinimumContribution = (availableForStake, contributorsNum) => {
  const minStakingAmount = availableForStake / (4 - contributorsNum);
  return minStakingAmount;
};

export default calcMinimumContribution;
