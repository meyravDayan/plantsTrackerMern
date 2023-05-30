// import { Button, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user";
import { FcGoogle } from "react-icons/fc";
// import { GoogleSigninButton } from "@react-native-google-signin/google-signin";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // We are consuming our user-management context to
    // get & set the user details here
    const { user, fetchUser, emailPasswordLogin, googleSignin } =
        useContext(UserContext);

    // We are using React's "useState" hook to keep track
    //  of the form values.
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // This function will be called whenever the user edits the form.
    const onFormInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    // This function will redirect the user to the
    // appropriate page once the authentication is done.
    const redirectNow = () => {
        const redirectTo = location.search.replace("?redirectTo=", "");
        navigate(redirectTo ? redirectTo : "/");
    };

    // Once a user logs in to our app, we don’t want to ask them for their
    // credentials again every time the user refreshes or revisits our app,
    // so we are checking if the user is already logged in and
    // if so we are redirecting the user to the home page.
    // Otherwise we will do nothing and let the user to login.
    const loadUser = async () => {
        if (!user) {
            const fetchedUser = await fetchUser();
            if (fetchedUser) {
                // Redirecting them once fetched.
                redirectNow();
            }
        }
    };

    // This useEffect will run only once when the component is mounted.
    // Hence this is helping us in verifying whether the user is already logged in
    // or not.
    useEffect(() => {
        loadUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // This function gets fired when the user clicks on the "Login" button.
    const onSubmit = async (event) => {
        try {
            // Here we are passing user details to our emailPasswordLogin
            // function that we imported from our realm/authentication.js
            // to validate the user credentials and log in the user into our App.
            const user = await emailPasswordLogin(form.email, form.password);
            if (user) {
                redirectNow();
            }
        } catch (error) {
            if (error.statusCode === 401) {
                alert("Invalid username/password. Try again!");
            } else {
                alert(error);
            }
        }
    };
    return (
        <div>
            <div className="container mt-5">
                <h1 className="login-header my-4">Log in to your account</h1>
                <h5 className="mb-4">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </h5>

                <div className="col-sm-8">
                    <button
                        type="button"
                        className="btn btn-outline-secondary google-btn my-2"
                        onClick={() => googleSignin()}
                    >
                        <FcGoogle size="24" /> Log in with Google
                    </button>
                    <div className="row my-2">
                        <div className="col">
                            <hr />
                        </div>
                        <div className="col-auto">
                            Or with email and password
                        </div>
                        <div className="col">
                            <hr />
                        </div>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="userName">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    name="email"
                                    value={form.email}
                                    onChange={onFormInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    name="password"
                                    value={form.password}
                                    onChange={onFormInputChange}
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-dark mt-2"
                                onClick={onSubmit}
                            >
                                Log In
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
