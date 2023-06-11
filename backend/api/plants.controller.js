import PlantsDAO from "../dao/plantsDAO.js";
// import RestaurantsDAO from "../dao/restaurantsDAO.js";
import { plantProfile, wateringFrequencyDaysValues } from "../plantProfile.js";

export default class PlantsController {
    static async apiGetUserPlants(req, res, next) {
        const plantsPerPage = req.query.plantsPerPage
            ? parseInt(req.query.plantsPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        const userId = req.params.userId;
        let filters = {};
        if (req.query.location) {
            filters.location = req.query.location;
        }
        if (req.query.species) {
            filters.species = req.query.species;
        }
        if (req.query.nickname) {
            filters.nickname = req.query.nickname;
        }

        const { plantsList, totalNumPlants } = await PlantsDAO.getPlants({
            filters,
            page,
            plantsPerPage,
            userId,
        });

        let response = {
            plants: plantsList,
            user_id: userId,
            page: page,
            filters: filters,
            entries_per_page: plantsPerPage,
            total_results: totalNumPlants,
        };
        res.json(response);
    }

    static async apiPostPlant(req, res, next) {
        try {
            const userId = req.params.userId;
            const newPlantProfile = {
                prefrences: {},
            };
            plantProfile.forEach((field) => {
                console.log(field);
                if (field.substring(0, 10) === "prefrenced") {
                    let fieldString = field.substring(10);
                    let dbString =
                        fieldString.charAt(0).toLowerCase() +
                        fieldString.slice(1);
                    newPlantProfile.prefrences[dbString] = req.body[field]
                        ? req.body[field]
                        : null;
                } else {
                    console.log(req.body[field]);
                    newPlantProfile[field] = req.body[field]
                        ? req.body[field]
                        : null;
                }
            });
            newPlantProfile.waterFrequencyScores = wateringFrequencyDaysValues[
                newPlantProfile.prefrences.water
            ]
                ? wateringFrequencyDaysValues[newPlantProfile.prefrences.water]
                : 0;
            newPlantProfile.dateCreated = new Date().toJSON().slice(0, 10);
            console.log(newPlantProfile);
            const PlantProfileResponse = await PlantsDAO.addPlant(
                userId,
                newPlantProfile
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdatePlant(req, res, next) {
        try {
            const ids = {
                plantId: req.query.id,
                userId: req.params.userId,
            };
            const newPlantProfile = {};
            // creating a list of all the object that are being included in the request body
            let filteredPlantProfile = plantProfile.filter(
                (field) => req.body[field]
            );
            // creating an object of all the fields that are being updated
            filteredPlantProfile.forEach((field) => {
                if (field.substring(0, 10) === "prefrenced") {
                    let fieldString = field.substring(10);
                    newPlantProfile[
                        `prefrences.${
                            fieldString.charAt(0).toLowerCase() +
                            fieldString.slice(1)
                        }`
                    ] = req.body[field];
                } else {
                    newPlantProfile[field] = req.body[field];
                }
            });
            // newPlantProfile.dateCreated = new Date().toJSON().slice(0, 10);
            if (prefrencedWater in filteredPlantProfile) {
                newPlantProfile.waterFrequencyScores =
                    wateringFrequencyDaysValues[
                        newPlantProfile.prefrences.water
                    ]
                        ? wateringFrequencyDaysValues[
                              newPlantProfile.prefrences.water
                          ]
                        : 0;
            }
            const plantResponse = await PlantsDAO.updatePlant(
                ids,
                newPlantProfile
            );

            let { error } = plantResponse;
            if (error) {
                res.status(400).json({ error });
            }

            if (plantResponse.modifiedCount === 0) {
                throw new Error("unable to update plant");
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // static async apiDeletePlants(req, res, next) {
    //     try {
    //         const userId = req.params.userId;
    //         const plantResponse = await PlantsDAO.deletePlants(userId);
    //         res.json({ status: "success" });
    //     } catch (e) {
    //         res.status(500).json({ error: e.message });
    //     }
    // }

    static async apiDeletePlant(req, res, next) {
        try {
            const plantId = req.query.id;
            const plantResponse = await PlantsDAO.deletePlant(plantId);
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetPlantById(req, res, next) {
        try {
            let id = req.params.plantId || {};
            let plant = await PlantsDAO.getPlantByID(id);
            if (!plant) {
                res.status(404).json({ error: "Not found" });
                return;
            }
            console.log(res.json(plant));
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetPlantsLocations(req, res, next) {
        try {
            let locations = await PlantsDAO.getLocations(req.params.userId);
            res.json(locations);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }
}
