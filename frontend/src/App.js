import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPlant from "./components/add-plant";
import PlantsList from "./components/plants-list";
import Plant from "./components/plant";
import Login from "./components/login";
import EditPlant from "./components/edit-plant";
import Signup from "./components/sign-up";
import NavigationBar from "./components/navigation-bar";
import Redirection from "./components/redirection";
import { UserProvider } from "./contexts/user";
import PrivateRoute from "./components/private-route";

function App() {
    return (
        <div>
            <UserProvider>
                <NavigationBar />
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/signup" element={<Signup />} />
                    {/* We are protecting our Home Page from unauthenticated */}
                    {/* users by wrapping it with PrivateRoute here. */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<PlantsList />} />
                        <Route path="/redirect" element={<Redirection />} />
                        <Route path="/plant" element={<PlantsList />} />
                        <Route
                            path="/user/:userId/plant/add_plant"
                            element={<AddPlant />}
                        />
                        <Route
                            path="/user/:userId/plant/:plantId/edit_plant"
                            element={<EditPlant />}
                        />
                        <Route path="/plant/:plantId" element={<Plant />} />
                    </Route>
                </Routes>
            </UserProvider>
        </div>
    );
}
export default App;
