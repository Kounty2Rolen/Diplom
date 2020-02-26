class CodeService {
  public SendCode(Code: object) {
    return new Promise((result, error) => {
      fetch("Code/Index", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(Code)
      }).then(Response => result(Response.json()));
    });
  }
  public ModelGenerateService(ConectionData: object) {
    return new Promise((result, error) => {
      fetch("Code/ModelGenerate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        body: JSON.stringify(ConectionData)
      }).then(Response => {
        result(Response);
      });
    });
  }
}

export default new CodeService();
