import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let users;

export default class UsersDAO {
    static async injectDB(conn) {
        if (users) {
            return;
        }
        try {
            users = await conn.db(process.env.PLANTS_NS).collection("users");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in usersDAO: ${e}`
            );
        }
    }

    static async addUser(user) {
        try {
            return await users.insertOne(user);
            // return postResponse;
        } catch (e) {
            console.error(`Unable to post user, ${e}`);
            return { error: e };
        }
    }

    static async getUser(userId) {
        try {
            let getResponse = await users.findOne({
                _id: new ObjectId(userId),
            });
            return getResponse;
        } catch (e) {
            console.error(`Unable to get user. ${e}`);
            return { error: e };
        }
    }

    static async deleteUser(userId) {
        try {
            let deleteResponse = await users.deleteOne({
                _id: new ObjectId(userId),
            });
            return deleteResponse;
        } catch (e) {
            console.error(`Unable to delete, ${e}`);
            return { error: e };
        }
    }
}
