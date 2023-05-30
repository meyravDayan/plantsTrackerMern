import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
// import RestaurantsDAO from "./dao/restaurantsDAO.js";
// import ReviewsDAO from "./dao/reviewsDAO.js";
import PlantsDAO from "./dao/plantsDAO.js";
import UsersDAO from "./dao/usersDAO.js";

dotenv.config();
const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;
MongoClient.connect(process.env.PLANTSTRACKER_DB_URI, {
    maxPoolSize: 50,
    waitQueueTimeoutMS: 2500,
    useNewUrlParser: true,
})
    .catch((err) => {
        console.error(err.stack);
        process.exit(1);
    })
    .then(async (client) => {
        // get the initial reference to the restaurants collection in the DB
        await PlantsDAO.injectDB(client);
        // same for the reviews collection
        await UsersDAO.injectDB(client);
        // starting the server
        app.listen(port, () => console.log(`listening on port ${port}`));
    });
