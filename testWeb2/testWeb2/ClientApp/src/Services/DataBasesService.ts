class DBService {
  public GetTables(connectionString: string) {
    return fetch("DataBase/GetTables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: JSON.stringify(connectionString)
    }).then(Response => {
      return Response.json();
    });
  }
}
export default new DBService();
