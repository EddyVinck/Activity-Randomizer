const activityRandomzizer = {
  activitiesFromSheet: [],

  getActivities() {
    return this.activitiesFromSheet;
  },
  setActivities(newActivities) {
    this.activitiesFromSheet = newActivities;
  },
};

export default activityRandomzizer;
