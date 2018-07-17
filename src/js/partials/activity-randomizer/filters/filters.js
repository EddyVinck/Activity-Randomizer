const getFilters = () => {
  const timeRange = document.querySelector('[time-range]');

  const filters = {
    maxTime: timeRange.value,
  };
  filters.maxTime = timeRange.value;

  return filters;
};

const filterActivities = (activities, filters) => {
  /**
   * // filter based on time
   * Because activity.time is a string it needs to be converted
   * to a number before comparing it to the value of the time range.
   */
  const filteredActivities = activities.filter(
    (activity) => Number(activity.time) <= filters.maxTime
  );
  return filteredActivities;
};

const handleCompletelyFilteredOutActivities = () => {};

export { getFilters, filterActivities, handleCompletelyFilteredOutActivities };
