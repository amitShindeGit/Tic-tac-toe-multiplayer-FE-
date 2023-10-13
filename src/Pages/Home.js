import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoomServices from "../Services/Room";
import classes from "../styles/Dashboard.module.css";

const Home = () => {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
    sessionStorage.removeItem("boardId");
    sessionStorage.removeItem("gameProgress");
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
      if (data?.name) {
        if (data?.name?.length > 8) {
          alert("Room name cannot be greater than 8 characters");
          return;
        }
        await RoomServices.CreateRoom(token, data);
        fetchAllRooms();
        setNewRoom("");
      }
    } catch (e) {
      console.log(e, "Error");
    }
  };

  const addPlayerToRoom = async (roomId) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const data = {
      id: roomId,
      players: payload?.id,
    };

    await RoomServices.UpdateRoomById(token, data);
  };

  return (
    <div>
      <h1 className={classes.titleTxt}>Dashboard</h1>
      <input
        value={newRoom}
        placeholder="type room name here"
        onChange={(e) => setNewRoom(e.target.value)}
      />
      <button onClick={createNewRoom} className={classes.button85}>
        Create room
      </button>
      {rooms?.map((room) => (
        <div key={room._id} className={classes.secondDiv}>
          <p className={classes.roomTxt}>{room.name}</p>
          <Link
            onClick={() => addPlayerToRoom(room._id)}
            to={`/room/${room._id}`}
            style={{ pointerEvents: room?.players?.length >= 2 && "none" }}
            className={classes.link}
          >
            {room?.players?.length >= 2 ? "Room full" : "Join"}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
