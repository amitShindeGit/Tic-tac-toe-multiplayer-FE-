import React, { useEffect, useState } from "react";
import TicTacToe from "../components/TicTacToe";
import RoomServices from "../Services/Room";
// import { socket } from "../Services/Socket";
import BoardServices from "../Services/Board";
import { io } from "socket.io-client";
import UserService from "../Services/User";

const Room = () => {
  const [room, setRoom] = useState({});
  const room_id = window.location.pathname.split("/").pop();
  const [newBoardId, setNewBoardId] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const newSocket = io("http://localhost:3001", {
      query: {
        token: token,
      },
    });

    function onConnect() {
      console.log("success", "Socket Connected!");
    }

    function onDisconnect() {
      console.log("disconn", "Socket Dis-Connected!");
    }

    if (token && !newSocket.connected) {
      newSocket.on("connect", onConnect);
      newSocket.on("disconnect", onDisconnect);
    }

    setSocket(newSocket);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const gameInProgress = sessionStorage.getItem("gameProgress");
    const existingBoardId = sessionStorage.getItem("boardId");

    (async () => {
      if (room_id && !existingBoardId) {
        
        // if (!gameInProgress) {
        //Check for board availabilty for 2nd player
        const allBoardsRes = await BoardServices.GetAllBoards(token);
        const allBoardData = await allBoardsRes.json();

        const allCurrentRoomBoards = allBoardData?.filter(
          (board) => board.room === room_id
        );

        const availableBoardForNewSecondPlayer = allCurrentRoomBoards?.filter(
          (board) =>
            board.players.length < 2 && board.players[0]?.id !== payload?.id
        );

        availableBoardForNewSecondPlayer.sort(
          (objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)
        );

        const secondUserData = await fetchUserById(payload?.id);

        if (availableBoardForNewSecondPlayer?.length) {
          const updateBoardData = {
            id: availableBoardForNewSecondPlayer[0]._id,
            players: [
              {
                id: payload?.id,
                name: secondUserData?.name ?? "Player",
                move:
                  availableBoardForNewSecondPlayer[0].players[0].move === "X"
                    ? "O"
                    : "X",
              },
            ],
          };

          const updatedBoardRes = await BoardServices.UpdateBoard(
            token,
            updateBoardData
          );

          const updatedBoardData = await updatedBoardRes.json();

          setNewBoardId(updatedBoardData?.updateBoard._id);
          sessionStorage.setItem("boardId", updatedBoardData?.updateBoard._id);
          return;
        }

        //New Player or First Player to join room
        const boardData = {
          room: room_id,
        };
        const newBoardRes = await BoardServices.CreateBoard(token, boardData);
        const newBoardData = await newBoardRes.json();

        const firstUserData = await fetchUserById(payload?.id);

        const updateBoardData = {
          id: newBoardData?.boardData?._id,
          players: [
            {
              id: payload?.id,
              name: firstUserData?.name ?? "Player",
              move: "X",
            },
          ],
        };

        const updatedBoardRes = await BoardServices.UpdateBoard(
          token,
          updateBoardData
        );
        const updatedBoardData = await updatedBoardRes.json();
        setNewBoardId(updatedBoardData?.updateBoard?._id);
        sessionStorage.setItem("boardId", updatedBoardData?.updateBoard?._id);
        // } else {
        //   console.log("sec")
        //   setNewBoardId(sessionStorage.getItem("boardId"));
        // }
      } else {
        setNewBoardId(existingBoardId);
      }
    })();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (socket && room_id && newBoardId) {
      console.log(newBoardId,"new  id")
      socket.emit("joinRoom", {
        roomId: room_id,
        userId: payload?.id,
        boardId: newBoardId
      });
    }

    return () => {
      //Component Unmount
      if (socket) {
        socket.emit("leaveRoom", {
          roomId: room_id,
        });
      }
    };
    //eslint-disable-next-line
  }, [room_id, socket, newBoardId]);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    (async () => {
      if (room_id && token) {
        try {
          const roomRes = await RoomServices.GetRoomById(token, room_id);
          const roomData = await roomRes.json();
          setRoom(roomData);
        } catch (e) {
          console.log(e, "Error");
        }
      }
    })();
  }, [room_id]);

  const fetchUserById = async (id) => {
    const token = sessionStorage.getItem("token");
    const userRes = await UserService.getUserById(token, id);
    const userData = await userRes.json();

    return userData;
  };

  return newBoardId ? (
    <TicTacToe board_id={newBoardId} room_id={room_id} socket={socket} />
  ) : (
    <>Loading board</>
  );
};

export default Room;
