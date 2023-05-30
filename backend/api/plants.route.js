import express from "express";
import PlantsCtrl from "./plants.controller.js";

const router = express.Router();
// Plants related routes:
router
    .route("/user/:userId/plant")
    .get(PlantsCtrl.apiGetUserPlants)
    .post(PlantsCtrl.apiPostPlant)
    .patch(PlantsCtrl.apiUpdatePlant)
    .delete(PlantsCtrl.apiDeletePlant);
// .delete(PlantsCtrl.apiDeletePlants);

router.route("/plant/:plantId").get(PlantsCtrl.apiGetPlantById);
// .delete(PlantsCtrl.apiDeletePlant);

router.route("/user/:userId/locations").get(PlantsCtrl.apiGetPlantsLocations);

export default router;
