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
    const existingBoardId = sessionStorage.getItem("boardId");

    // (async () => {
    handleBoard(existingBoardId);

    // })();
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    let timeout;
    if (socket && room_id && newBoardId) {
      socket.emit("joinRoom", {
        roomId: room_id,
        userId: payload?.id,
        boardId: newBoardId,
      });

      socket.on("resetGame", ({ boardId }) => {
        if (boardId) {
          timeout = setTimeout(() => {
            setNewBoardId(boardId);
            handleBoard();
            sessionStorage.setItem("boardId", boardId);
          }, 5000);
        }
      });
    }

    window.onbeforeunload = close_event_function;
    function close_event_function() {
      //Runs on Window close or refresh
      socket.emit("updateRoomPlayers", {
        roomId: room_id,
        userId: payload?.id,
      });
      return null;
    }

    return () => {
      //Component Unmount
      if (timeout) {
        clearTimeout(timeout);
      }
      if (socket) {
        socket.emit("leaveRoom", {
          roomId: room_id,
          userId: payload?.id,
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

  const handleBoard = async (existingBoardId) => {
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
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
                availableBoardForNewSecondPlayer[0].players[0]?.move === "X"
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

        if (socket) {
          socket.emit("onPlayAgain", {
            roomId: updatedBoardData?.updateBoard?.room,
            boardData: updatedBoardData?.updateBoard,
          });
        }
        return;
      }

      //New Player or First Player to join room
      const boardData = {
        room: room_id,
      };
      const newBoardRes = await BoardServices.CreateBoard(token, boardData);
      const newBoardData = await newBoardRes.json();

      if (socket) {
        socket.emit("playAgain", {
          roomId: room_id,
          boardId: newBoardData?.boardData?._id,
        });
      }

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
  };

  const fetchUserById = async (id) => {
    const token = sessionStorage.getItem("token");
    const userRes = await UserService.getUserById(token, id);
    const userData = await userRes.json();

    return userData;
  };

  useEffect(() => {
    const roomId = window.location.pathname.split("/").pop();
    if (roomId) {
      addPlayerToRoom(roomId);
    }
  }, []);

  const addPlayerToRoom = async (roomId) => {
    const token = sessionStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const data = {
      id: roomId,
      players: payload?.id,
    };

    await RoomServices.UpdateRoomById(token, data);
  };

  // const handleReset = () => {
  //   sessionStorage.removeItem("boardId");

  //   handleBoard();
  // };

  return newBoardId ? (
    <TicTacToe
      board_id={newBoardId}
      room_id={room_id}
      socket={socket}
      // handleReset={handleReset}
      handleBoard={handleBoard}
    />
  ) : (
    <>Loading board</>
  );
};

export default Room;
