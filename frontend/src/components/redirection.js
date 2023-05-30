import React, { useEffect, useContext } from "react";
import { handleAuthRedirect } from "realm-web";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user";

handleAuthRedirect();

export default function Redirection() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user.isLoggedIn) {
            // redirect to home page
            navigate("/");
        }
    }, []); // eslint-disable-line

    return <h1>Signing in... Please Wait</h1>;
}
