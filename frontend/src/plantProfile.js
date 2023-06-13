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

const initialGetPlantState = {
    species: "",
    nickname: "",
    lastWatered: "Unspecified",
    lastFertilized: "Unspecified",
    prefrences: {
        light: "",
        water: "",
        humidity: "",
        typeOfWatering: "",
    },
    sensitivities: "",
    notes: "",
    progressImages: [],
    location: "",
    dataCreated: null,
};

const initialPostPlantState = {
    species: "Unspecified",
    nickname: "",
    lastWatered: null,
    lastFertilized: null,
    prefrencedLight: "",
    prefrencedWater: "",
    prefrencedHumidity: "",
    prefrencedWateringType: "",
    sensitivities: "Unspecified",
    notes: "Unspecified",
    progressImages: null,
    location: "Unspecified",
    dataCreated: null,
};

const LightingOptions = [
    "Low light",
    "Medium light",
    "Bright indirect light",
    "Direct sunlight",
    "Unspecified",
];

const wateringFrequencyOptions = [
    "When the soil is dry",
    "Keep soil dump",
    "Once a week",
    "Once every two weeks",
    "Once a month",
    "Rule of thumb",
    "Unspecified",
    "Other",
];

const wateringTypeOptions = [
    "Wateing can",
    "Misting",
    "Bottom watering",
    "Gradual flow",
    "Unspecified",
];

const HumidityOptions = [
    "80% - 90% Tropical",
    "60% - 80%",
    "40% - 60%",
    "10% - 40% Dry",
    "Unspecified",
];

const wateringFrequencyDaysValues = {
    "Keep soil dump": 1,
    "Once a week": 7,
    "Once every two weeks": 14,
    "Once a month": 31,
};

export {
    plantProfile,
    initialGetPlantState,
    initialPostPlantState,
    HumidityOptions,
    wateringTypeOptions,
    wateringFrequencyOptions,
    LightingOptions,
    wateringFrequencyDaysValues,
};
