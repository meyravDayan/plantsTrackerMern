import { useContext } from "react";
import { UserContext } from "../contexts/user";
import { Link, useLocation } from "react-router-dom";

const NavigationBar = () => {
    const { user, logOutUser } = useContext(UserContext);
    const location = useLocation();
    const { pathname } = location;

    const logOut = async () => {
        try {
            // Calling the logOutUser function from the user context.
            const loggedOut = await logOutUser();
            // Now we will refresh the page, and the user will be logged out and
            // redirected to the login page because of the <PrivateRoute /> component.
            if (loggedOut) {
                window.location.reload(true);
            }
        } catch (error) {
            alert(error);
        }
    };

    const getMail = (email) => {
        return email.split("@")[0];
    };

    return (
        <nav className="navbar navbar-expand navbar-dark sticky-top">
            <div className="container-fluid">
                {pathname === "/plant" || pathname === "/" ? (
                    <a className="navbar-brand" href="#">
                        <img
                            src="/images/md-website-favicon-color.png"
                            alt=""
                            width="30"
                            height="30"
                            className="d-inline-block align-text-top"
                        ></img>{" "}
                        PlantsTracker
                    </a>
                ) : (
                    <Link className="navbar-brand" to="/plant">
                        <img
                            src="/images/md-website-favicon-color.png"
                            alt=""
                            width="30"
                            height="30"
                            className="d-inline-block align-text-top"
                        />{" "}
                        PlantsTracker
                    </Link>
                )}
                <div>
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link to={"/plant"} className="nav-link">
                                plants
                            </Link>
                        </li>
                        <li className="nav-item">
                            {user ? (
                                <a
                                    className="nav-link"
                                    style={{ cursor: "pointer" }}
                                >
                                    Welcome, {getMail(user._profile.data.email)}
                                    !{" "}
                                    <span
                                        className="logout-text"
                                        onClick={logOut}
                                    >
                                        (Logout)
                                    </span>
                                </a>
                            ) : (
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
