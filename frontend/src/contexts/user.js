import { createContext, useEffect, useState } from "react";
import { App, Credentials } from "realm-web";
import { useNavigate } from "react-router-dom";

// Creating a Realm App Instance
const app = new App(process.env.REACT_APP_REALM_APP_ID);

// Creating a user context to manage and access all the user related functions
// across different components and pages.
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isLoggedIn) {
            // redirect to home page
            navigate("/");
        }
    }, [user?.isLoggedIn]); // eslint-disable-line

    const googleSignin = async () => {
        const credential = Credentials.google(
            process.env.REACT_APP_REDIRECT_URL
        );
        const userResp = await app.logIn(credential);
        setUser(userResp);
    };

    // Function to log in user into our App Service app using their email & password
    const emailPasswordLogin = async (email, password) => {
        const credentials = Credentials.emailPassword(email, password);
        const authenticatedUser = await app.logIn(credentials);
        setUser(authenticatedUser);
        return authenticatedUser;
    };

    // Function to sign up user into our App Service app using their email & password
    const emailPasswordSignup = async (email, password) => {
        try {
            await app.emailPasswordAuth.registerUser(email, password);
            // Since we are automatically confirming our users, we are going to log in
            // the user using the same credentials once the signup is complete.
            return emailPasswordLogin(email, password);
        } catch (error) {
            throw error;
        }
    };

    // Function to fetch the user (if the user is already logged in) from local storage
    const fetchUser = async () => {
        if (!app.currentUser) return false;
        try {
            await app.currentUser.refreshCustomData();
            // Now, if we have a user, we are setting it to our user context
            // so that we can use it in our app across different components.
            setUser(app.currentUser);
            return app.currentUser;
        } catch (error) {
            throw error;
        }
    };

    // Function to logout user from our App Services app
    const logOutUser = async () => {
        if (!app.currentUser) return false;
        try {
            await app.currentUser.logOut();
            // Setting the user to null once loggedOut.
            setUser(null);
            return true;
        } catch (error) {
            throw error;
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                fetchUser,
                emailPasswordLogin,
                emailPasswordSignup,
                logOutUser,
                googleSignin,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
