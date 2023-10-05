function Tile({ className, value, onClick, playerTurn }) {
    let hoverClass = null;
    if (value == "" && playerTurn != null) {
      hoverClass = `${playerTurn.toLowerCase()}-hover`;
    }
    return (
      <div onClick={onClick} className={`tile ${className} ${hoverClass}`}>
        {value}
      </div>
    );
  }
  
  export default Tile;