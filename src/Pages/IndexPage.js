import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IndexPage = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  console.log(token,"token")
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }, []);
  return <div></div>;
};

export default IndexPage;
