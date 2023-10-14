export default class BoardServices {
  //Create a board
  static CreateBoard = async (token, data) => {
    return await fetch(`https://tictactoebe.onrender.com/board`, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  //Get a board by ID
  static GetBoardByID = async (token, id) => {
    return await fetch(`https://tictactoebe.onrender.com/board/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  //Get all board
  static GetAllBoards = async (token) => {
    return await fetch(`https://tictactoebe.onrender.com/board`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  //Update a board
  static UpdateBoard = async (token, data) => {
    const id = data?.id;
    return await fetch(`https://tictactoebe.onrender.com/board/${id}`, {
      method: "PATCH",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
}
