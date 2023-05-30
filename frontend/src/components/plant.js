import React, { useState, useEffect, useContext } from "react";
import PlantDataService from "../services/plant";
import { Link, useParams, useNavigate } from "react-router-dom";
import { plantProfile, initialGetPlantState } from "../plantProfile";
import plantDataService from "../services/plant";
import { getCurrentDate } from "../utils";
import { UserContext } from "../contexts/user";

function Plant(props) {
    const params = useParams();
    const { user } = useContext(UserContext);
    const userId = user.id;
    const [imageFile, setImageFile] = useState(null);
    const [plant, setPlant] = useState(initialGetPlantState);
    const [imageUpdateFlag, setImageUpdateFlag] = useState(false);
    const navigation = useNavigate();

    const getPlant = (id) => {
        PlantDataService.get(id)
            .then((response) => {
                setPlant(response.data);
                setImageUpdateFlag(false);
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => {
        getPlant(params.plantId);
    }, [params.plantId]);

    useEffect(() => {
        if (imageUpdateFlag) {
            // update
            plantDataService.updatePlant(userId, plant._id, plant);
        } else {
            // initial plant retrieve, therefore set the flag to true
            setImageUpdateFlag(true);
        }
    }, [plant.progressImages]); // eslint-disable-line

    const deletePlant = (uId, pId) => {
        let result = window.confirm("Want to delete?");
        if (result) {
            PlantDataService.deletePlant(uId, pId)
                .then((response) => {
                    console.log("deletion complete.");
                    navigation("/");
                    return true;
                })
                .catch((e) => console.log(e));
        } else {
            return false;
        }
    };

    function convertCamelToRegular(expression) {
        let seperateExpression = expression.replace(/([A-Z])/g, " $1");
        return (
            seperateExpression.charAt(0).toUpperCase() +
            seperateExpression.slice(1)
        );
    }

    const displayAddImageInput = () => {
        document.getElementById("add-image-button").style.display = "none"; // hide input field
        document.getElementById("add-image-title").style.display = "block"; //display input title
        document.getElementById("add-image-input").style.display = "block"; //display input field
        document.getElementById("submit-image-button").style.display = "block"; // hide input title
    };

    const changeImageInput = (e) => {
        let file = e.target.files[0];
        setImageFile(file);
    };

    const handleAddImage = () => {
        if (imageFile && imageFile.type.match("image.*")) {
            hostAndUpdateImage();
        } else {
            alert("No image selected.");
        }
    };

    const hostAndUpdateImage = () => {
        const today = getCurrentDate();
        const rf = new FileReader();
        rf.readAsDataURL(imageFile);
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
                    setPlant((previousState) => {
                        return {
                            ...previousState,
                            progressImages: previousState.progressImages.concat(
                                [
                                    {
                                        imgUrl: jsonRes.data.url,
                                        dateTaken: today,
                                    },
                                ]
                            ),
                        };
                    });
                    console.log(imageFile);
                    console.log(plant.progressImages);
                })
                .catch((err) => console.log(err));
        };
    };

    return (
        <div className="d-flex align-items-center justify-content-center">
            {plant ? (
                <div>
                    <h3 className="d-flex align-items-center justify-content-center">
                        🌼{plant.nickname}🌻
                    </h3>
                    <div>
                        {plantProfile.map((field, index) => {
                            if (field !== "nickname") {
                                if (field.substring(0, 10) === "prefrenced") {
                                    return (
                                        <div key={index}>
                                            <strong>
                                                {convertCamelToRegular(field)}:{" "}
                                            </strong>
                                            {plant.prefrences[
                                                field.charAt(10).toLowerCase() +
                                                    field.slice(11)
                                            ]
                                                ? plant.prefrences[
                                                      field
                                                          .charAt(10)
                                                          .toLowerCase() +
                                                          field.slice(11)
                                                  ]
                                                : "Unspecified"}
                                        </div>
                                    );
                                } else {
                                    if (
                                        field === "progressImages" &&
                                        plant.progressImages
                                    ) {
                                        return (
                                            <div>
                                                <strong>
                                                    Plant progress in images :{" "}
                                                </strong>
                                                {plant.progressImages.length ===
                                                0 ? (
                                                    <p>No images were taken.</p>
                                                ) : (
                                                    <div className="row">
                                                        {" "}
                                                        {plant.progressImages.map(
                                                            (
                                                                imageObj,
                                                                imageInd
                                                            ) => {
                                                                return (
                                                                    <div
                                                                        className="card image-card mx-2 my-2"
                                                                        key={
                                                                            "img" +
                                                                            imageInd
                                                                        }
                                                                    >
                                                                        <img
                                                                            className="card-img-top"
                                                                            src={
                                                                                imageObj.imgUrl
                                                                            }
                                                                            alt="..."
                                                                        ></img>
                                                                        <div className="card-body">
                                                                            <p className="card-text">
                                                                                Taken{" "}
                                                                                {
                                                                                    imageObj.dateTaken
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}{" "}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={index}>
                                                <strong>
                                                    {convertCamelToRegular(
                                                        field
                                                    )}
                                                    :{" "}
                                                </strong>
                                                {plant[field]
                                                    ? plant[field]
                                                    : "Unspecified"}
                                            </div>
                                        );
                                    }
                                }
                            }
                            return <div></div>;
                        })}
                    </div>
                    <div className="text-center">
                        <div>
                            <button
                                type="button"
                                id="add-image-button"
                                className="btn btn-outline-secondary mb-1 mx-1 col-lg-5 plant-profile-btn"
                                onClick={displayAddImageInput}
                            >
                                Add Image
                            </button>
                            <label
                                htmlFor="add-image"
                                id="add-image-title"
                                className="form-label"
                                style={{ display: "none" }}
                            >
                                Choose an image
                            </label>
                            <input
                                onChange={changeImageInput}
                                className="form-control mb-1 mx-1"
                                placeholder="Enter location name"
                                name="progressImages"
                                id="add-image-input"
                                style={{ display: "none" }}
                                type="file"
                            ></input>
                            <button
                                type="button"
                                id="submit-image-button"
                                className="btn btn-outline-secondary mb-1 mx-1 col-lg-5 form-control plant-profile-btn"
                                style={{ display: "none" }}
                                onClick={handleAddImage}
                            >
                                Submit Image
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => deletePlant(userId, plant._id)}
                                className="btn btn-outline-secondary col-lg-5 mx-1 mb-1 plant-profile-btn"
                            >
                                Delete Plant
                            </button>
                        </div>
                        <div>
                            <Link
                                to={`/user/${userId}/plant/${plant._id}/edit_plant`}
                                className="btn btn-outline-secondary col-lg-5 mx-1 mb-1 plant-profile-btn"
                            >
                                Edit Plant
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <br />
                    <p>No plant selected.</p>
                </div>
            )}
        </div>
    );
}

export default Plant;
