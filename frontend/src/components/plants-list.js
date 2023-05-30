import React, { useState, useEffect, useContext, useCallback } from "react";
import plantDataService from "../services/plant";
import { Link } from "react-router-dom";
import { GiFertilizerBag } from "react-icons/gi";
import { IoIosWater } from "react-icons/io";
import { SlPlus } from "react-icons/sl";
import { getCurrentDate, getDaysDiff } from "../utils";
import { wateringFrequencyDaysValues } from "../plantProfile";
import { UserContext } from "../contexts/user";

function PlantsList() {
    const today = getCurrentDate();
    const { user } = useContext(UserContext);
    const userId = user.id;
    const [plants, setPlants] = useState([]);
    const [locations, setLocations] = useState(["All Locations"]);
    const [searchFilter, setSearchFilter] = useState({
        nickname: "",
        location: "All Locations",
        species: "",
    });
    const [searchBtn, setSearchBtn] = useState(false);

    // function that sort the list of plants by the amount of days past watering
    const sortByWateringNeeds = useCallback(
        (plantsList) => {
            const sortedList = plantsList.sort(function (a, b) {
                return daysPastWatering(b, today) - daysPastWatering(a, today);
            });
            return sortedList;
        },
        [today]
    );

    // get user's locations and plants list
    useEffect(() => {
        const retrievePlants = () => {
            plantDataService
                .getAll(userId)
                .then((response) => {
                    const sortedPlants = sortByWateringNeeds(
                        response.data.plants
                    );
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
                    setLocations(["All Locations"].concat(response.data));
                })
                .catch((e) => {
                    console.log(e);
                });
        };

        retrievePlants();
        retrieveLocations();
    }, [sortByWateringNeeds, userId]);

    const onChangeSearchField = (e) => {
        const searchField = e.target.name;
        const searchValue = e.target.value;
        setSearchFilter((previousState) => {
            return { ...previousState, [searchField]: searchValue };
        });
    };

    const refreshList = () => {
        findPlant();
    };

    const findPlant = () => {
        if (searchFilter.location === "All Locations") {
            setSearchFilter((previousState) => {
                return { ...previousState, location: "" };
            });
            setSearchBtn(true);
        } else {
            setSearchBtn(true);
        }
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

    const find = useCallback(() => {
        plantDataService
            .filterSearch(userId, searchFilter)
            .then((response) => {
                const sortedPlants = sortByWateringNeeds(response.data.plants);
                setPlants(sortedPlants);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [searchFilter, userId, sortByWateringNeeds]);

    useEffect(() => {
        if (searchBtn) {
            find();
            setSearchBtn(false);
        }
    }, [searchBtn, userId, sortByWateringNeeds, find]);

    //
    return (
        <div>
            <div>
                <div className="row g-3 justify-content-center main-search mx-2 my-2 pb-4 border rounded-1">
                    <div className="col-md-3">
                        <label htmlFor="searchNickname" className="form-label">
                            Nickname
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="searchNickname"
                            onChange={onChangeSearchField}
                            name="nickname"
                            defaultValue={searchFilter.nickname}
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchSpecies" className="form-label">
                            Species
                        </label>
                        <input
                            defaultValue={searchFilter.species}
                            type="text"
                            className="form-control"
                            id="searchSpecies"
                            onChange={onChangeSearchField}
                            name="species"
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="searchLocation" className="form-label">
                            Location
                        </label>
                        <select
                            className="form-select"
                            onChange={onChangeSearchField}
                            id="searchLocation"
                            name="location"
                            defaultValue={
                                searchFilter.location !== ""
                                    ? searchFilter.location
                                    : "All Locations"
                            }
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
                    </div>
                    <div className="col-md-2 d-grid gap-2">
                        <br />
                        <button
                            className="btn btn-outline-secondary search-btn"
                            type="button"
                            onClick={findPlant}
                        >
                            Search
                        </button>
                    </div>
                </div>
                {/* ###end of search form #### */}
                {/* <div className="col input-group justify-content-center">
                    <div className="input-group-append col-md-3">
                        <Link
                            to={`/user/${userId}/plant/add_plant`}
                            className="btn btn-outline-dark add-plants-btn d-grid gap-2"
                        >
                            Create new plant 🌱
                        </Link>
                    </div>
                </div> */}
            </div>
            <br />
            <div className="row mx-2 g-2">
                <div className="col-md-4 col-lg-3 col-sm-6 pb-1">
                    <div className="card h-100">
                        <div className="card-body">
                            <h6>
                                <br />
                            </h6>
                            <h5 className="card-title text-center">
                                <br />
                            </h5>
                            <div className=" img-container position-relative">
                                <img
                                    src="/images/cute_sunflower.png"
                                    alt=""
                                    className="img-thumbnail plant-thumbnail mx-auto"
                                />
                                <Link to={`/user/${userId}/plant/add_plant`}>
                                    <SlPlus className="plus-sign position-absolute start-50 translate-middle-x text-success" />
                                </Link>
                            </div>
                            <br />
                            <br />
                            <div className="mb-5">
                                <h3 className="card-title text-center new-plant-text text-success">
                                    Create new plant
                                </h3>
                                <br />
                            </div>
                        </div>
                    </div>
                </div>
                {plants.map((plant) => {
                    return (
                        <div
                            key={plant._id}
                            className="col-md-4 col-lg-3 col-sm-6 pb-1"
                        >
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-center">
                                        {plant.nickname}
                                    </h5>
                                    {daysPastWatering(plant, today) >= 0 ? (
                                        <h6 className=" text-center">
                                            Needs watering 💧
                                        </h6>
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
                                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
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
                                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
                                                disabled
                                            >
                                                <IoIosWater
                                                    style={{ color: "#088395" }}
                                                />{" "}
                                                Plant watered
                                            </button>
                                        )}
                                    </div>
                                    <div className="row">
                                        {determineButtonActive(
                                            plant.lastFertilized
                                        ) ? (
                                            <button
                                                type="submit"
                                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
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
                                                className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
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
                                            className="btn btn-outline-dark col-lg-10 mb-1 mx-auto"
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
