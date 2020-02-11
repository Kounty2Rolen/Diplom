import { Result } from "../Components/Code/ResultCode";


class GetInfo {
  public getInfo() {
    return new Promise((result, error) => {
      fetch("AccountEdit/getInfo", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        }
      }).then(Response => result(Response.json()));
    });
  }

  public getProjects() {
    return new Promise((result, error) => {
    fetch("AccountEdit/GetProjects", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")}})
        .then(Response => Response.json())
        .then(data=>result(data));});
      }
    }

export default new GetInfo();
