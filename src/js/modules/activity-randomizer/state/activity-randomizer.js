const activityRandomizer = {
  activitiesFromSheet: [],
  sheetValid: false,

  getActivities() {
    return this.activitiesFromSheet;
  },
  setActivities(newActivities) {
    this.activitiesFromSheet = newActivities;
  },
  sgtDocumentValidity() {
    return this.sheetValid;
  },
  setDocumentValidity(validity) {
    this.sheetValid = validity;
  },
};

export default activityRandomizer;
