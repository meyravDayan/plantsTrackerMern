import express from "express";
import cors from "cors";
// import restaurants from "./api/restaurants.route.js";
import plants from "./api/plants.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/v1/resturants", restaurants); //api url, routes location
app.use("/api/v1/plants_tracker", plants); //api url, routes location
app.use("*", (req, res) => res.status(404).json({ error: "not found" })); //if someone is trying to get a routes that doesn't exist

export default app;
