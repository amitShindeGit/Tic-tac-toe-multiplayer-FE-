export default class UserService {
  //Register user
  static RegisterUser = async (data) => {
    return await fetch("https://tictactoebe.onrender.com/user/register", {
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
    return await fetch("https://tictactoebe.onrender.com/user/login", {
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
    return await fetch(`https://tictactoebe.onrender.com/user/${id}`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
