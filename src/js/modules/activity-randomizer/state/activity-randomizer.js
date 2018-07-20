const activityRandomizer = {
  activitiesFromSheet: [],
  documentValid: false,

  getActivities() {
    return this.activitiesFromSheet;
  },
  setActivities(newActivities) {
    this.activitiesFromSheet = newActivities;
    return this;
  },
  getDocumentValidity() {
    return this.documentValid;
  },
  setDocumentValidity(validity) {
    this.documentValid = validity;
    return this;
  },
};

export default activityRandomizer;
