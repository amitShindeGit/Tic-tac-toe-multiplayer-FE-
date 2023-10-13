import { useState, useEffect } from "react";
import Board from "./Board";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import BoardServices from "../Services/Board";
import { getKeyByValue } from "../utils";
import classes from "../styles/TicTacToe.module.css";

const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  //Rows
  { combo: [0, 1, 2], strikeClass: "strike-row-1" },
  { combo: [3, 4, 5], strikeClass: "strike-row-2" },
  { combo: [6, 7, 8], strikeClass: "strike-row-3" },

  //Columns
  { combo: [0, 3, 6], strikeClass: "strike-column-1" },
  { combo: [1, 4, 7], strikeClass: "strike-column-2" },
  { combo: [2, 5, 8], strikeClass: "strike-column-3" },

  //Diagonals
  { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
  { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

function TicTacToe({ board_id, room_id, socket, handleBoard }) {
  const [tiles, setTiles] = useState(Array(9).fill(""));
  const [playerTurn, setPlayerTurn] = useState({});
  const [strikeClass, setStrikeClass] = useState();
  const [gameState, setGameState] = useState(GameState.inProgress);
  const token = sessionStorage.getItem("token");
  const payload = JSON.parse(atob(token.split(".")[1]));
  const isCurrentPlayerTurn = playerTurn?.id === payload?.id;

  const [boardData, setBoardData] = useState({});

  async function checkWinner(tiles) {
    for (const { combo, strikeClass } of winningCombinations) {
      const tileValue1 = tiles[combo[0]];
      const tileValue2 = tiles[combo[1]];
      const tileValue3 = tiles[combo[2]];
      if (
        tileValue1 !== "" &&
        tileValue1 !== null &&
        tileValue1 === tileValue2 &&
        tileValue1 === tileValue3
      ) {
        setStrikeClass(strikeClass);
        if (tileValue1 === PLAYER_X) {
          const data = {
            id: board_id,
            winner: PLAYER_X,
          };
          await BoardServices.UpdateBoard(token, data);
          setGameState(GameState.playerXWins);
        } else {
          const data = {
            id: board_id,
            winner: PLAYER_O,
          };
          await BoardServices.UpdateBoard(token, data);
          setGameState(GameState.playerOWins);
        }
        return;
      }
    }

    const areAllTilesFilledIn = tiles.every((tile) => tile !== "");
    if (areAllTilesFilledIn) {
      const data = {
        id: board_id,
        winner: PLAYER_X + "-" + PLAYER_O,
      };
      await BoardServices.UpdateBoard(token, data);
      setGameState(GameState.draw);
    }
  }

  const handleTileClick = async (index) => {
    sessionStorage.setItem("gameProgress", getKeyByValue(GameState, gameState));

    if (gameState !== GameState.inProgress || !isCurrentPlayerTurn) {
      return;
    }

    if (tiles[index] !== "") {
      return;
    }
    let currentTurn;
    if (!playerTurn) {
      currentTurn = PLAYER_X;
    } else if (playerTurn?.move) {
      currentTurn = playerTurn?.move;
    }

    if (socket) {
      socket.emit("playerMove", {
        roomId: room_id,
        move: currentTurn,
        boardId: board_id,
        tileNumber: index,
      });
    }
    fetchCurrentBoard(boardData);
  };

  const fetchCurrentBoard = (updatedBoard) => {
    const user = payload;

    if (board_id) {
      try {
        const boardData = structuredClone(updatedBoard);
        const currentPlayerWithMove = boardData?.players?.filter(
          (player) => player?.id === user?.id
        );
        const currentPlayerWihoutMove = boardData?.players?.filter(
          (player) => player?.id !== user?.id
        );

        if (!boardData?.lastMove?.length) {
          setPlayerTurn({
            id: boardData?.players[0]?.id,
            move: boardData?.players[0]?.move,
          });
        } else if (
          boardData?.lastMove[0]?.id !== user?.id &&
          currentPlayerWithMove?.length
        ) {
          setPlayerTurn({ id: user?.id, move: currentPlayerWithMove[0]?.move });
        } else if (currentPlayerWihoutMove?.length) {
          setPlayerTurn({
            id: currentPlayerWihoutMove[0]?.id,
            move: currentPlayerWihoutMove[0]?.move,
          });
        } else {
          setPlayerTurn({
            id: user?.id,
            move: boardData?.lastMove[0]?.move === "X" ? "O" : "X",
          });
        }
        setBoardData(boardData);
        // setTiles(boardData?.board);
      } catch (e) {
        console.log(e, "Erorr");
      }
    }
  };

  useEffect(() => {
    (async () => {
      const boardRes = await BoardServices.GetBoardByID(token, board_id);
      const boardData = await boardRes.json();
      fetchCurrentBoard(boardData);
    })();

    socket.on("onResetGame", ({ boardData }) => {
      setBoardData(boardData);

      setGameState(GameState.inProgress);
      setStrikeClass(null);
    });
  }, [board_id]);

  useEffect(() => {
    setTiles(boardData?.board);
    boardData?.board?.length && checkWinner(boardData?.board);
  }, [boardData]);

  useEffect(() => {
    if (
      socket &&
      board_id &&
      getKeyByValue(GameState, gameState) === "inProgress"
    ) {
      socket.on("newPlayerJoinedRoom", ({ boardId, boardData }) => {
        // const currentBoardRes = await BoardServices.GetBoardByID(
        //   token,
        //   boardId
        // );
        // const currentBoardData = await currentBoardRes.json();
        fetchCurrentBoard(boardData);
      });

      socket.on("updateBoard", ({ updatedBoard }) => {
        fetchCurrentBoard(updatedBoard);
      });
    }

    if (board_id) {
      sessionStorage.setItem(
        "gameProgress",
        getKeyByValue(GameState, gameState)
      );
    }
  }, [tiles]);

  const handleReset = () => {
    sessionStorage.removeItem("boardId");
    setGameState(GameState.inProgress);
    setStrikeClass(null);
    handleBoard();
  };

  return boardData?.players?.length === 2 && tiles?.length ? (
    <div>
      <h1 className={classes.titleTxt}>Tic - Tac - Toe</h1>
      <div className={classes.secondDiv}>
        {boardData?.players?.length >= 1 ? (
          <div>
            <p className={classes.playerTxt1}>
              Player1 :{" "}
              {`${boardData?.players[0]?.name} ( ${boardData?.players[0]?.move} )`}
            </p>
          </div>
        ) : (
          <></>
        )}
        <Board
          playerTurn={isCurrentPlayerTurn ? playerTurn?.move : null}
          tiles={tiles}
          onTileClick={handleTileClick}
          strikeClass={strikeClass}
        />
        {boardData?.players?.length >= 2 ? (
          <div>
            <p className={classes.playerTxt2}>
              Player2 :{" "}
              {`${boardData?.players[1]?.name} ( ${boardData?.players[1]?.move} )`}
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className={classes.btnDiv}>
        <GameOver gameState={gameState} />
        <Reset gameState={gameState} onReset={handleReset} />
      </div>
    </div>
  ) : (
    <div className={`${classes.mainDiv} ${classes.waitTxt}`}>
      Waiting for another player to join the room...
    </div>
  );
}

export default TicTacToe;
