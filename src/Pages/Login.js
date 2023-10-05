import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Services/User";

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
      const loginRes = await UserService.LoginUser(data);
      const loginData = await loginRes.json();

      sessionStorage.setItem("token", loginData.token);
      
      navigate("/");
    } catch (e) {
      console.log(e, "Error");
    }
  };
  return (
    <div>
      <div>
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
      <button onClick={loginUser}>Login</button>
    </div>
  );
};

export default Login;
