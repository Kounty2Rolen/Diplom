class CodeService {
    public SendCode(Code: object) {
        return fetch("Code/Index", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(Code)
        }).then((Response) => Response.json());
    }
    public ModelGenerateService(ConectionData: object) {
        return fetch("Code/ModelGenerate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("Token")
            },
            body: JSON.stringify(ConectionData)
        }).then((Response) => {
            if (!Response.ok) {
                alert("Model compilation error, check the connection string.");
                return "";
            } else {
                return Response.text();
            }
        });
    }
}

export default new CodeService();