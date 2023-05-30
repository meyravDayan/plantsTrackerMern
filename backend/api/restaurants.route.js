import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();
// Restaurants routes:
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);
//  Reviews routes:
router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview);

export default router;
