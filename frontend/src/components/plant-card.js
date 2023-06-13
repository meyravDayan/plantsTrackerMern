import React from "react";
import { Link } from "react-router-dom";
import { GiFertilizerBag } from "react-icons/gi";
import { IoIosWater } from "react-icons/io";
import { getCurrentDate, getDaysDiff } from "../utils";
import { wateringFrequencyDaysValues } from "../plantProfile";

// userId, plantId
const PlantCard = ({ userId, plant, onWatering, onFertilizing }) => {
    const today = getCurrentDate();

    const determineButtonActive = (lastTime) => {
        // const today = getCurrentDate();
        return !(lastTime === today);
    };

    const daysPastWatering = (plant, currentDate) => {
        if (wateringFrequencyDaysValues[plant.prefrences.water]) {
            const diffDays = getDaysDiff(plant.lastWatered, currentDate);
            const wateringFrequency =
                wateringFrequencyDaysValues[plant.prefrences.water];
            return diffDays - wateringFrequency;
        }
        return -1;
    };

    const chooseImage = (progressImages) => {
        if (progressImages.length > 0) {
            return (
                <img
                    src={progressImages[progressImages.length - 1].imgUrl}
                    alt=""
                    className="img-thumbnail mx-auto mb-2 d-block plant-thumbnail"
                />
            );
        }
        return (
            <img
                src="/images/cute_plant.png"
                alt=""
                className="img-thumbnail mx-auto mb-2 d-block plant-thumbnail"
            />
        );
    };

    const watering = (userId, plantId) => {
        onWatering(userId, plantId);
    };

    const fertilizing = (userId, plantId) => {
        onFertilizing(userId, plantId);
    };

    //
    return (
        <div key={plant._id} className="col-md-4 col-lg-3 col-sm-6 pb-1">
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title text-center">{plant.nickname}</h5>
                    {daysPastWatering(plant, today) >= 0 ? (
                        <h6 className=" text-center">Needs watering 💧</h6>
                    ) : (
                        <h6>
                            <br />
                        </h6>
                    )}
                    {chooseImage(plant.progressImages)}
                    <p className="card-text text-center">
                        <strong>Location: </strong>
                        {plant.location}
                        <br />
                        <strong>Species: </strong>
                        {plant.species}
                        <br />
                        <strong>Last Time Watered: </strong>
                        {plant.lastWatered ? plant.lastWatered : "Unspecified"}
                        <br />
                        <strong>Last Time Fertilized: </strong>
                        {plant.lastFertilized
                            ? plant.lastFertilized
                            : "Unspecified"}
                    </p>
                    <div className="row">
                        {determineButtonActive(plant.lastWatered) ? (
                            <button
                                type="submit"
                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                                onClick={() => watering(userId, plant._id)}
                            >
                                <IoIosWater style={{ color: "#088395" }} />{" "}
                                Water Plant
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                                disabled
                            >
                                <IoIosWater style={{ color: "#088395" }} />{" "}
                                Plant watered
                            </button>
                        )}
                    </div>
                    <div className="row">
                        {determineButtonActive(plant.lastFertilized) ? (
                            <button
                                type="submit"
                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                                onClick={() => fertilizing(userId, plant._id)}
                            >
                                <GiFertilizerBag style={{ color: "#9E6F21" }} />{" "}
                                Fertilize Plant
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                                disabled
                            >
                                <GiFertilizerBag style={{ color: "#9E6F21" }} />{" "}
                                Plant fertilized
                            </button>
                        )}
                    </div>
                    <div className="row">
                        <Link
                            to={"/plant/" + plant._id}
                            className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                            style={{ color: "#D14D72" }}
                        >
                            🔎 View Plant
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlantCard;
