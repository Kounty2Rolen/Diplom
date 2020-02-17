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
            })
                .then(Response => result(Response.json()));
        });
    }
}

export default new CodeService();