class ProjectService {
  RemoveProj = (item: string) => {
    return fetch("Project/RemoveProject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: item
    });
  };
  projectLoad=(id:string)=>{

    return fetch("/Code/ProjectLoad",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept:"application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: id
    }).then(Response=>Response.text());
  }
}
export default new ProjectService();
