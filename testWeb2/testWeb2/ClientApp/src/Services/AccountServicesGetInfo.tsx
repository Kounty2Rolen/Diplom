import { Result } from "../Components/Code/ResultCode";

interface state {
  OldPassword: string;
  NewPassword: string;
  projects: string[];
  Person: {
    fname: string;
    mname: string;
    loginName: string;
  };
}

class GetInfo {

    
  public getInfo() {
      return new Promise((result, error)=>{ let OldPassword: string="";
      let PersonInfo;
      fetch("AccountEdit/getInfo", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        }
      })
        .then(Response => Response.json())
        .then(data=>result(data));})
   
  }
  public getProjects() {
    fetch("AccountEdit/GetProjects", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    })
      .then(Response => Response.json())
      .then(data => this.setState({ projects: data }));
    return this.state.projects;
  }
}

export default new GetInfo();
