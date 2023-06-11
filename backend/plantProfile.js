const plantProfile = [
    "species",
    "nickname",
    "lastWatered",
    "lastFertilized",
    "prefrencedLight",
    "prefrencedWater",
    "prefrencedHumidity",
    "prefrencedWateringType",
    "sensitivities",
    "notes",
    "location",
    "progressImages",
    // "dateCreated",
];

const wateringFrequencyDaysValues = {
    "Keep soil dump": 1000,
    "Once a week": 500,
    "Once every two weeks": 100,
    "Once a month": 10,
};

export default { plantProfile, wateringFrequencyDaysValues };
