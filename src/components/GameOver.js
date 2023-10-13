import GameState from "./GameState";

function GameOver({ gameState }) {
  switch (gameState) {
    case GameState.inProgress:
      return <></>;
    case GameState.playerOWins:
      return (
        <div className="gameOverWrap">
          <div className="gameOver">O won</div>
        </div>
      );
    case GameState.playerXWins:
      return (
        <div className="gameOverWrap">
          <div className="gameOver">X won</div>
        </div>
      );
    case GameState.draw:
      return (
        <div className="gameOverWrap">
          <div className="gameOver">Draw</div>
        </div>
      );
    default:
      return <></>;
  }
}

export default GameOver;
