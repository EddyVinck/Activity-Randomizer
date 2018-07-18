import activityRandomizer from '../state/activity-randomizer';

const setTimeRangeMaxValue = (activities) => {
  const timeRange = document.querySelector('[time-range]');
  const timeRangeValue = document.querySelector('[time-range-value]');
  const timeRangeMaxValueIndicator = document.querySelector('.max');

  timeRange.disabled = true;
  const activitiesToCheckForMaxTime = activities || activityRandomizer.getActivities();
  let maxTime = null;

  maxTime = activitiesToCheckForMaxTime.reduce((accumulator, currentActivity) => {
    const time = Number(currentActivity.time);
    return time > accumulator ? time : accumulator;
  }, null);

  timeRange.max = maxTime;
  timeRange.value = maxTime;
  timeRangeMaxValueIndicator.innerHTML = maxTime;
  timeRangeValue.textContent = timeRange.value;

  if (timeRange.disabled === true && timeRange.max !== 'null') {
    timeRange.disabled = false;
  }
};

const disableFilters = () => {
  const timeRange = document.querySelector('[time-range]');
  timeRange.disabled = true;
};

export { setTimeRangeMaxValue, disableFilters };
