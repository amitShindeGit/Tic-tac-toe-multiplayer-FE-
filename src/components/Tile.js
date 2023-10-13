function Tile({ className, value, onClick, playerTurn }) {
    let hoverClass = null;
    let cursorNotAllowed = null;
    if (value == "" && playerTurn != null) {
      hoverClass = `${playerTurn.toLowerCase()}-hover`;
    }else{
      cursorNotAllowed = "cursorNotAllowed"
    }
    return (
      <div onClick={onClick} className={`tile ${className} ${hoverClass} ${cursorNotAllowed}`}>
        {value}
      </div>
    );
  }
  
  export default Tile;