import React, { useState, useEffect } from "react";
import plantDataService from "../services/plant";
import { Link } from "react-router-dom";
import { GiFertilizerBag } from "react-icons/gi";
import { IoIosWater } from "react-icons/io";
import { getCurrentDate, getDaysDiff } from "../utils";
import { wateringFrequencyDaysValues } from "../plantProfile";

function PlantsList(props) {
    const today = getCurrentDate();
    const userId = props.user.id;
    const [plants, setPlants] = useState([]);
    const [searchLocation, setSearchLocation] = useState("");
    const [searchSpecies, setSearchSpecies] = useState("");
    const [searchNickname, setSearchNickname] = useState("");
    const [locations, setLocations] = useState(["All Locations"]);

    useEffect(() => {
        retrievePlants();
        retrieveLocations();
    }, []);

    const onChangeSearchNickname = (e) => {
        const searchNickname = e.target.value;
        setSearchNickname(searchNickname);
    };

    const onChangeSearchLocation = (e) => {
        const searchLocation = e.target.value;
        setSearchLocation(searchLocation);
    };

    const onChangeSearchSpecies = (e) => {
        const searchSpecies = e.target.value;
        setSearchSpecies(searchSpecies);
    };

    const retrievePlants = () => {
        plantDataService
            .getAll(userId)
            .then((response) => {
                const sortedPlants = sortByWateringNeeds(response.data.plants);
                setPlants(sortedPlants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const retrieveLocations = () => {
        plantDataService
            .getLocations(userId)
            .then((response) => {
                console.log(response.data);
                setLocations(["All Locations"].concat(response.data));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const refreshList = () => {
        retrievePlants();
    };

    const find = (query, by) => {
        console.log(query, by);
        plantDataService
            .find(userId, query, by)
            .then((response) => {
                const sortedPlants = sortByWateringNeeds(response.data.plants);
                setPlants(sortedPlants);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const findByNickname = () => {
        find(searchNickname, "nickname");
    };

    const findByLocation = () => {
        if (searchLocation === "All Locations") {
            refreshList();
        } else {
            find(searchLocation, "location");
        }
    };

    const findBySpecies = () => {
        find(searchSpecies, "species");
    };

    const handleWatering = (userId, plantId) => {
        const today = getCurrentDate();
        plantDataService
            .updatePlant(userId, plantId, { lastWatered: today })
            .then((resp) => refreshList())
            .catch((e) => console.log(e));
    };

    const handleFertilizer = (userId, plantId) => {
        const today = getCurrentDate();
        plantDataService
            .updatePlant(userId, plantId, {
                lastFertilized: today,
            })
            .then((resp) => refreshList())
            .catch((e) => console.log(e));
    };

    const determineButtonActive = (lastTime) => {
        const today = getCurrentDate();
        return !(lastTime === today);
    };

    const sortByWateringNeeds = (plantsList) => {
        const sortedList = plantsList.sort(function (a, b) {
            return daysPastWatering(b, today) - daysPastWatering(a, today);
        });
        return sortedList;
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

    //
    return (
        <div>
            <div className="row g-3 ">
                <div className="col input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by nickname"
                        value={searchNickname}
                        onChange={onChangeSearchNickname}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary search-btn"
                            type="button"
                            onClick={findByNickname}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="col input-group">
                    <input
                        type="text"
                        className="form-control "
                        placeholder="Search by species"
                        value={searchSpecies}
                        onChange={onChangeSearchSpecies}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary search-btn"
                            type="button"
                            onClick={findBySpecies}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="col input-group">
                    <select
                        className="form-select"
                        onChange={onChangeSearchLocation}
                    >
                        {locations.map((location, index) => {
                            return (
                                <option key={index} value={location}>
                                    {" "}
                                    {location.substr(0, 20)}{" "}
                                </option>
                            );
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary search-btn"
                            type="button"
                            onClick={findByLocation}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="col input-group">
                    <div className="input-group-append">
                        <Link
                            to={`/user/${userId}/plant/add_plant`}
                            className="btn btn-outline-dark add-plants-btn"
                        >
                            Add Plant 🌱
                        </Link>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                {plants.map((plant) => {
                    return (
                        <div key={plant._id} className="col-lg-4 pb-1 mx-auto">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title text-center">
                                        {plant.nickname}
                                    </h5>
                                    {daysPastWatering(plant, today) >= 0 ? (
                                        <h6 className=" text-center">
                                            Needs watering 💧
                                        </h6>
                                    ) : (
                                        ""
                                    )}
                                    <img
                                        src="/images/cute_plant.png"
                                        alt=""
                                        className="img-thumbnail mx-auto d-block"
                                        style={{
                                            borderRadius: "50%",
                                            maxWidth: "60%",
                                        }}
                                    ></img>
                                    <p className="card-text">
                                        <strong>Location: </strong>
                                        {plant.location}
                                        <br />
                                        <strong>Species: </strong>
                                        {plant.species}
                                        <br />
                                        <strong>Last Time Watered: </strong>
                                        {plant.lastWatered}
                                        <br />
                                        <strong>Last Time Fertilized: </strong>
                                        {plant.lastFertilized}
                                    </p>
                                    <div className="row">
                                        {determineButtonActive(
                                            plant.lastWatered
                                        ) ? (
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark col-lg-5 mx-1 mb-1 mx-auto"
                                                onClick={() =>
                                                    handleWatering(
                                                        userId,
                                                        plant._id
                                                    )
                                                }
                                            >
                                                <IoIosWater
                                                    style={{ color: "#088395" }}
                                                />{" "}
                                                Water Plant
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark col-lg-5 mx-1 mb-1 mx-auto"
                                                disabled
                                            >
                                                <IoIosWater
                                                    style={{ color: "#088395" }}
                                                />{" "}
                                                Plant watered
                                            </button>
                                        )}
                                        {determineButtonActive(
                                            plant.lastFertilized
                                        ) ? (
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark col-lg-5 mx-1 mb-1 mx-auto"
                                                onClick={() =>
                                                    handleFertilizer(
                                                        userId,
                                                        plant._id
                                                    )
                                                }
                                            >
                                                <GiFertilizerBag
                                                    style={{ color: "#9E6F21" }}
                                                />{" "}
                                                Fertilize Plant
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark col-lg-5 mx-1 mb-1 mx-auto"
                                                disabled
                                            >
                                                <GiFertilizerBag
                                                    style={{ color: "#9E6F21" }}
                                                />{" "}
                                                Plant fertilized
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        <Link
                                            to={"/plant/" + plant._id}
                                            className="btn btn-outline-dark col-lg-5 mx-1 mb-1 mx-auto"
                                            style={{ color: "#D14D72" }}
                                        >
                                            View Plant
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PlantsList;
