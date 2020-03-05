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
}
export default new ProjectService();
