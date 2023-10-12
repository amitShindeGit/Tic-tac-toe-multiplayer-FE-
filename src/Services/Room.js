export default class RoomServices {
  //Get all rooms
  static GetAllRooms = async (token) => {
    return await fetch("http://localhost:3001/room", {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  //Create a room
  static CreateRoom = async (token, data) => {
    return await fetch("http://localhost:3001/room", {
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

  //Get a room
  static GetRoomById = async (token, id) => {
    return await fetch(`http://localhost:3001/room/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  //Update a room
  static UpdateRoomById = async (token, data) => {
    const id = data?.id;
    return await fetch(`http://localhost:3001/room/${id}`, {
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
