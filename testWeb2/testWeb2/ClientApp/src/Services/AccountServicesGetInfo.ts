class GetInfo {
  public getInfo() {
    return fetch("AccountEdit/getInfo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    }).then(Response => Response.json());
  }
  public getToken(Person: any) {
    return fetch("/Account/Token", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(Person)
    }).then(Response => Response.text());
  }
  public getIdentity() {
    return fetch("/Account/GetLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    }).then(Response => Response.json());
  }
  public getProjects() {
    return fetch("AccountEdit/GetProjects", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      }
    }).then(Response => Response.json());
  }

  public PasswordEdit(Passwords: object) {
    return fetch("AccountEdit/EditPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("Token")
      },
      body: JSON.stringify(Passwords)
    }).then(Response => Response);
  }

  public FioChange(Person: object) {
    return fetch("AccountEdit/PersonEdit", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(Person)
    });
  }

  public GetProjectInfo(ProjectId: string) {
    return new Promise((result, error) => {
      fetch("/Project/GetProjectInfo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("Token")
        },
        body: JSON.stringify(ProjectId)
      }).then(Response => result(Response.json()));
    });
  }

  public Register(Person: object) {
    return fetch("Register/RegisterUser", {
      method: "POST",
      headers: {
        Authorization: "" + sessionStorage.getItem("Token"),
        "Content-type": "application/json"
      },
      body: JSON.stringify(Person)
    }).then(Response => {
      if (!Response.ok) {
        alert("Some error, please check creds.");
      } else {
        return Response.text();
      }
    });
  }
}

export default new GetInfo();
