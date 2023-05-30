import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import plantDataService from "../services/plant";
import { initialPostPlantState } from "../plantProfile";
import { getCurrentDate } from "../utils";
import "./css/App.css";

function AddPlant() {
    let today = getCurrentDate();
    const navigate = useNavigate();
    const { userId } = useParams();
    const [plantInfo, setPlantInfo] = useState(initialPostPlantState);
    const [locations, setLocations] = useState(["Other"]);
    const [postResponse, setPostResponse] = useState(null);

    useEffect(() => {
        const retrieveLocations = () => {
            plantDataService
                .getLocations(userId)
                .then((response) => {
                    setLocations(["Other"].concat(response.data));
                })
                .catch((e) => {
                    console.log(e);
                });
        };
        retrieveLocations();
    }, [userId]);

    useEffect(() => {
        if (postResponse) {
            navigate("/");
        }
    }, [postResponse, navigate]);

    const onChangeField = (e) => {
        const fieldName = e.target.name;
        const fieldValue = e.target.value;
        setPlantInfo((previousState) => {
            return { ...previousState, [fieldName]: fieldValue };
        });
    };

    const handleFile = (e) => {
        // post image and recieve url.
        plantInfo.progressImages = e.target.files[0];
    };

    const checkLocation = (e) => {
        const locationValue = e.target.value;
        if (locationValue === "Other") {
            document.getElementById("location-title").style.display = "block"; //display input title
            document.getElementById("location").style.display = "block"; //display input field
        } else {
            document.getElementById("location-title").style.display = "none"; // hide input title
            document.getElementById("location").style.display = "none"; // hide input field
            setPlantInfo((previousState) => {
                return { ...previousState, location: locationValue };
            });
        }
    };
    const checkNewLocation = (e) => {
        const locationValue = e.target.value;
        setPlantInfo((previousState) => {
            return { ...previousState, location: locationValue };
        });
    };

    const postPlant = async (id, plantInfo) => {
        setPostResponse(await plantDataService.createPlant(id, plantInfo));
    };

    const postWithImage = (id, plantInfo, rf) => {
        const imgFile = plantInfo.progressImages;
        rf.readAsDataURL(imgFile);
        rf.onloadend = function (event) {
            const body = new FormData();
            body.append("image", event.target.result.split(",").pop()); //To delete 'data:image/png;base64,' otherwise imgbb won't process it.
            fetch(
                "https://api.imgbb.com/1/upload?key=8140cd61031acde01bdf9f129a837de0",
                {
                    method: "POST",
                    body: body,
                }
            )
                .then((res) => res.json())
                .then((jsonRes) => {
                    plantInfo.progressImages = [
                        {
                            imgUrl: jsonRes.data.url,
                            dateTaken: today,
                        },
                    ];
                    postPlant(id, plantInfo);
                })
                .catch((err) => console.log(err));
        };
    };

    const submitForm = async (id, plantInfo) => {
        const rf = new FileReader();
        if (
            plantInfo.progressImages &&
            plantInfo.progressImages.type.match("image.*")
        ) {
            postWithImage(id, plantInfo, rf);
        } else {
            plantInfo.progressImages = [];
            postPlant(id, plantInfo);
        }
    };

    return (
        <form className="mx-4">
            <div className="mb-3">
                <label htmlFor="plantNickname" className="form-label">
                    Plant Nickname
                </label>
                <input
                    type="text"
                    name="nickname"
                    placeholder="Enter plant nickname"
                    className="form-control"
                    id="plantNickname"
                    onChange={onChangeField}
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="plantSpecies" className="form-label">
                    Plant Species
                </label>
                <input
                    type="text"
                    name="species"
                    placeholder="If known, enter plant species"
                    className="form-control"
                    onChange={onChangeField}
                    id="plantSpecies"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="lastTimeWatered" className="form-label">
                    Last Time Watered
                </label>
                <input
                    type="date"
                    max={today}
                    onChange={onChangeField}
                    name="lastWatered"
                    className="form-control"
                    id="lastTimeWatered"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="lastTimeFertilized" className="form-label">
                    Last Time Fertilized
                </label>
                <input
                    type="date"
                    max={today}
                    onChange={onChangeField}
                    name="lastFertilized"
                    className="form-control"
                    id="lastTimeFertilized"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="prefrencedLight" className="form-label">
                    Prefrenced Lighting
                </label>
                <select
                    className="form-select"
                    id="prefrencedLight"
                    onChange={onChangeField}
                    name="prefrencedLight"
                >
                    <option selected disabled value="">
                        Choose preferred lighting...
                    </option>
                    <option>Low light</option>
                    <option>Medium light</option>
                    <option>Bright indirect light</option>
                    <option>Direct sunlight</option>
                    <option>Unspecified</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="prefrencedWater" className="form-label">
                    Prefrenced Watering Frequency
                </label>
                <select
                    className="form-select"
                    onChange={onChangeField}
                    id="prefrencedWater"
                    name="prefrencedWater"
                >
                    <option selected disabled value="">
                        Choose preferred watering frequency...
                    </option>
                    <option>When the soil is dry</option>
                    <option>Keep soil dump</option>
                    <option>Once a week</option>
                    <option>Once every two weeks</option>
                    <option>Once a month</option>
                    <option>Rule of thumb</option>
                    <option>Unspecified</option>
                    <option>Other</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="prefrencedHumidity" className="form-label">
                    Prefrenced Humidity
                </label>
                <select
                    className="form-select"
                    onChange={onChangeField}
                    id="prefrencedHumidity"
                    name="prefrencedHumidity"
                >
                    <option selected disabled value="">
                        Choose preferred humidity condition...
                    </option>
                    <option>80% - 90% Tropical</option>
                    <option>60% - 80%</option>
                    <option>40% - 60%</option>
                    <option>10% - 40% Dry</option>
                    <option>Unspecified</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="prefrencedWateringType" className="form-label">
                    Prefrenced Watering Method
                </label>
                <select
                    className="form-select"
                    onChange={onChangeField}
                    id="prefrencedWateringType"
                    name="prefrencedWateringType"
                >
                    <option selected disabled value="">
                        Choose preferred watering method...
                    </option>
                    <option>Wateing can</option>
                    <option>Misting</option>
                    <option>Bottom watering</option>
                    <option>Gradual flow</option>
                    <option>Unspecified</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="sensitivities" className="form-label">
                    Known Sensitivities
                </label>
                <textarea
                    rows="3"
                    onChange={onChangeField}
                    placeholder="Known sensitivities..."
                    name="sensitivities"
                    className="form-control"
                    id="sensitivities"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                    Special Notes
                </label>
                <textarea
                    rows="3"
                    onChange={onChangeField}
                    placeholder="Add your notes..."
                    name="notes"
                    className="form-control"
                    id="notes"
                />
            </div>
            <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                    Plant's Location
                </label>
                <select
                    name="location"
                    className="form-control"
                    onChange={checkLocation}
                >
                    <option selected disabled value="">
                        Choose location...
                    </option>
                    {locations.map((location, index) => {
                        return (
                            <option key={index} value={location}>
                                {location.substr(0, 20)}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className="mb-3">
                <label
                    htmlFor="location"
                    id="location-title"
                    className="form-label"
                    style={{ display: "none" }}
                >
                    Add New Location
                </label>
                <input
                    onChange={checkNewLocation}
                    type="text"
                    placeholder="Enter location name"
                    name="location"
                    id="location"
                    style={{ display: "none" }}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                    Enter plant's image for developement tracking *optional*
                </label>
                <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    name="progressImages"
                    onChange={handleFile}
                />
            </div>
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => submitForm(userId, plantInfo)}
            >
                Submit Plant
            </button>
        </form>
    );
}

export default AddPlant;
