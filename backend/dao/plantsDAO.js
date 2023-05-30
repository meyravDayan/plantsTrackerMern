import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let plants;

export default class PlantsDAO {
    static async injectDB(conn) {
        if (plants) {
            return;
        }
        try {
            plants = await conn.db(process.env.PLANTS_NS).collection("plants");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in plantsDAO: ${e}`
            );
        }
    }

    static async getPlants({
        filters = null,
        page = 0,
        plantsPerPage = 20,
        userId = null,
    } = {}) {
        let query = {};
        if (userId) {
            query.user_id = new ObjectId(userId);
        }
        if (filters) {
            if ("nickname" in filters) {
                query.nickname = filters["nickname"];
            }
            if ("location" in filters) {
                query.location = filters["location"];
            }
            if ("species" in filters) {
                query.species = filters["species"];
            }
        }

        let cursor;

        try {
            cursor = await plants.find(query);
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { plantsList: [], totalNumPlants: 0 };
        }

        const displayCursor = cursor
            .limit(plantsPerPage)
            .skip(plantsPerPage * page);

        try {
            const plantsList = await displayCursor.toArray();
            const totalNumPlants = await plants.countDocuments(query);

            return { plantsList, totalNumPlants };
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            );
            return { plantsList: [], totalNumPlants: 0 };
        }
    }

    static async getPlantByID(id) {
        let plant;
        try {
            plant = await plants.findOne({ _id: new ObjectId(id) });
            return plant;
        } catch (e) {
            console.error(`Something went wrong in getPlantByID: ${e}`);
            throw e;
        }
    }

    static async getLocations(userId) {
        let locations = [];
        try {
            locations = await plants.distinct("location", {
                user_id: new ObjectId(userId),
            });
            return locations;
        } catch (e) {
            console.error(`Unable to get locations, ${e}`);
            return locations;
        }
    }

    static async deletePlant(plantId) {
        try {
            let deleteResponse = await plants.deleteOne({
                _id: new ObjectId(plantId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete plant, ${e}`);
            return { error: e };
        }
    }

    static async deletePlants(userId) {
        try {
            let deleteResponse = await plants.delete({
                user_id: new ObjectId(userId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete, ${e}`);
            return { error: e };
        }
    }

    static async updatePlant(ids, plantProfile) {
        try {
            const { plantId, userId } = ids;
            let updateResponse = await plants.updateOne(
                { _id: new ObjectId(plantId), user_id: new ObjectId(userId) },
                { $set: plantProfile }
            );
            return updateResponse;
        } catch (e) {
            console.error(`Unable to update, ${e}`);
            return { error: e };
        }
    }

    static async addPlant(userId, plantProfile) {
        try {
            plantProfile.user_id = new ObjectId(userId);
            console.log(plantProfile);
            return await plants.insertOne(plantProfile);
        } catch (e) {
            console.error(`Unable to post plant, ${e}`);
            return { error: e };
        }
    }
}
