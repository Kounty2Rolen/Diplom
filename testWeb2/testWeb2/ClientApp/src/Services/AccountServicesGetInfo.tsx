import { promises } from "dns";
import { Result } from "../Components/Code/ResultCode";

class GetInfo {
    public getInfo() {
        return new Promise((result, error) => {
            fetch("AccountEdit/getInfo", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((Response) => result(Response.json()));
        });
    }
    public getToken(Person: any) {
        return new Promise((result, error) => {
            fetch("/Account/Token", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(Person),
            })
                .then((Response) => Response.text())
                .then((data) => result(data));
        });
    }
    public getIdentity() {
        return new Promise((result, error) => {
            fetch("/Account/GetLogin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((Response) => result(Response.json()));
        });
    }
    public getProjects() {
        return new Promise((result, error) => {
            fetch("AccountEdit/GetProjects", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            })
                .then((Response) => Response.json())
                .then((data) => result(data));
        });
    }

    public PasswordEdit(Passwords: object) {
        return new Promise((result, error) => {
            fetch("AccountEdit/EditPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                body: JSON.stringify(Passwords),
            }).then((Response) => result(Response));
        });
    }

    public FioChange(Person: object) {
        return new Promise((result, error) => {
            fetch("AccountEdit/PersonEdit", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Person),
            });
        });
    }

    public GetProjectInfo(ProjectId: string) {
        return new Promise((result, error) => {
            fetch("/Project/GetProjectInfo", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
                body: JSON.stringify(ProjectId),
            }).then((Response) => result(Response.json()));
        });
    }

    public Register(Person: object) {
        return new Promise((result, error) => {
            fetch("Register/RegisterUser", {
                method: "POST",
                headers: {
                    Authorization: "" + sessionStorage.getItem("Token"),
                    "Content-type": "application/json",
                },
                body: JSON.stringify(Person),
            })
                .then((Response) => result(Response.text()));
        });
    }
}

export default new GetInfo();
