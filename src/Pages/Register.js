import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../Services/User";
import classes from "../styles/Auth.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    const data = {
      name,
      email,
      password,
    };
    try {
      if (name && email && password) {
        await UserService.RegisterUser(data);

        navigate("/login");
      }
    } catch (e) {
      alert("Please check all fields");
    }
  };
  return (
    <div className={classes.mainDiv}>
      <div className={classes.secondDiv}>
        <label htmlFor="name" className={classes.text}>
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={classes.secondDiv}>
        <label htmlFor="email" className={classes.text}>
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        />
      </div>
      <button className={classes.button85} onClick={registerUser}>
        Register
      </button>
      <Link className={classes.link} to="/login">
        Already have an account? Login
      </Link>
    </div>
  );
};

export default Register;
