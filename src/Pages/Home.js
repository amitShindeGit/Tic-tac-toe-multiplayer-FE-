import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomServices from "../Services/Room";
// import { socket } from "../Services/Socket";

const Home = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  //Socket connection
  // useEffect(() => {
  //   // socket.connect();

  //   function onConnect() {
  //     console.log("success", "Socket Connected!");
  //   }

  //   function onDisconnect() {
  //     console.log("disconn", "Socket Dis-Connected!");
  //   }
  //   console.log(socket, "socketsssss====");

  //   if (token && !socket.connected) {
  //     console.log("enter socket");
  //     socket.on("connect", onConnect);
  //     socket.on("disconnect", onDisconnect);
  //   }

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    const allRoomsRes = await RoomServices.GetAllRooms(token);
    const allRoomData = await allRoomsRes.json();

    if (allRoomData?.length) {
      setRooms(allRoomData);
    }
  };

  const createNewRoom = async () => {
    const data = { name: newRoom };
    try {
      await RoomServices.CreateRoom(token, data);
      fetchAllRooms();
      setNewRoom("");
    } catch (e) {
      console.log(e, "Error");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <input value={newRoom} onChange={(e) => setNewRoom(e.target.value)} />
      <button onClick={createNewRoom}>Create room</button>
      {rooms?.map((room) => (
        <div key={room._id}>
          <p>{room.name}</p>
          <Link to={`/room/${room._id}`}>Join</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
