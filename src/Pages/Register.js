import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Services/User";

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
      await UserService.RegisterUser(data);

      navigate("/login");
    } catch (e) {
      console.log(e, "Error");
    }
  };
  return (
    <div>
      <div>Registration</div>
      <div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={registerUser}>Register</button>
    </div>
  );
};

export default Register;
