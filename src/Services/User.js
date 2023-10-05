export default class UserService {
  //Register user
  static RegisterUser = async (data) => {
    return await fetch("http://localhost:3001/user/register", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  //Login user
  static LoginUser = async (data) => {
    return await fetch("http://localhost:3001/user/login", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };

  static getUserById = async (token, id) => {
    return await fetch(`http://localhost:3001/user/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
