class DBService {
  public GetTables(connectionString: string) {
    return fetch("DataBase/GetTables", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: JSON.stringify(connectionString)
    }).then(Response => {
      console.log(Response);
      
      Response.json()
    }).then(data=>{console.log(data)})

  }
}
export default new DBService();
