import React, { useEffect, useState } from "react";
import "./App.css";
import TicTacRoutes from "./Routes/TicTacRoutes";

function App() {
  const [socket, setSocket] = useState(null);

  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if(token){
      console.log("APP>JSSSSS")
    }
  }, [token])

  return <TicTacRoutes />;
}

export default App;
