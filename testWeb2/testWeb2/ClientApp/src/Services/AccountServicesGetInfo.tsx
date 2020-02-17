import { Result } from "../Components/Code/ResultCode";
import { promises } from "dns";

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
    public getToken(Person: any) {
        return new Promise((result, error) => {
            fetch("/Account/Token", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(Person)
            })
                .then(Response => Response.text())
                .then(data => result(data));
        });
    }
    public getIdentity() {
        return new Promise((result, error) => {
            fetch("/Account/GetLogin", {
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
                    Authorization: "Bearer " + sessionStorage.getItem("Token")
                }
            })
                .then(Response => Response.json())
                .then(data => result(data));
        });
    }
}

export default new GetInfo();