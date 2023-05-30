// import { Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // As explained in the Login page.
    const { emailPasswordSignup, googleSignin } = useContext(UserContext);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    // As explained in the Login page.
    const onFormInputChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    // As explained in the Login page.
    const redirectNow = () => {
        const redirectTo = location.search.replace("?redirectTo=", "");
        navigate(redirectTo ? redirectTo : "/");
    };

    // As explained in the Login page.
    const onSubmit = async () => {
        try {
            const user = await emailPasswordSignup(form.email, form.password);
            if (user) {
                redirectNow();
            }
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <div className="container mt-5">
                <h1 className="login-header my-4">Create your account</h1>
                <h5 className="mb-4">
                    Have an account already? <Link to="/login">Log in now</Link>
                </h5>

                <div className="col-sm-8">
                    <button
                        type="button"
                        className="btn btn-outline-secondary google-btn my-2"
                        onClick={() => googleSignin()}
                    >
                        <FcGoogle size="24" /> Continue with Google
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
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
