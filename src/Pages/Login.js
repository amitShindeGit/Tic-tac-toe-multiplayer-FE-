import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../Services/User";
import classes from "../styles/Auth.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    const data = {
      email,
      password,
    };
    try {
      if (email && password) {
        const loginRes = await UserService.LoginUser(data);
        const loginData = await loginRes.json();

        sessionStorage.setItem("token", loginData.token);

        navigate("/");
      }
    } catch (e) {
      alert("Please check all fields");
    }
  };
  return (
    <div className={classes.mainDiv}>
      <div className={classes.secondDiv}>
        <label htmlFor="email" className={classes.text}>
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="abc@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classes.input}
        />
      </div>
      <div className={classes.secondDiv}>
        <label htmlFor="password" className={classes.text}>
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={classes.input}
        />
      </div>
      <button className={classes.button85} onClick={loginUser}>
        Login
      </button>
      <Link className={classes.link} to="/register">Not Registered? Register</Link>
    </div>
  );
};

export default Login;
