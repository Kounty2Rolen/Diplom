import React, { ChangeEvent } from "react";
import {
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import CodeServices from "../Services/CodeServices";
import DBService from "../Services/DataBasesService";
import * as SignalR from "@aspnet/signalr";

interface state {
  CodeResult: string;
  text: string;
  connectionString: string;
  Context: string;
  spin: boolean;
  modal: boolean;
  check: boolean;
  tables: string[];
  selectedTables: string[];
}
interface props {
  ProjName: string;
}

export class ContextInput extends React.Component<props, state> {
  constructor(props: props) {
    super(props);
    this.state = {
      CodeResult: "",
      text: "",
      connectionString: "",
      Context: "",
      spin: false,
      modal: false,
      check: true,
      tables: [],
      selectedTables: [],
    };
  }
  sqlc = new SignalR.HubConnectionBuilder().withUrl("/sql").build();
  public checkClick = () => {
    this.setState((prevState) => {
      return {
        check: !prevState.check,
      };
    });
  };

  public GetTables() {
    DBService.GetTables(this.state.connectionString).then((Response: any) => {
      this.setState({ tables: Response });
    });
  }
  public toggle = () => {
    console.log(this.state.selectedTables);

    this.GetTables();
    this.setState((prevState) => {
      return {
        modal: !prevState.modal,
      };
    });
  };
  public doSomthing = () => {
    this.GenerateModel();
    this.toggle();
  };
  public btnOnClickModelGenerate = () => {
    this.setState({ spin: true });
    if (!this.state.check) {
      this.toggle();
    } else {
      this.GenerateModel();
    }
    // Отправка названия контекста и вызов генерации модели
  };
  GenerateModel = () => {
    const ConectionData = {
      ConnectionString: this.state.connectionString,
      ContextName: this.state.Context,
      ProjName: this.props.ProjName,
      selectedTables: this.state.selectedTables,
    };
    if (
      this.state.connectionString.length > 0 &&
      this.state.Context.length > 0
    ) {
      CodeServices.ModelGenerateService(ConectionData).then(
        (Response: string) => {
          if (Response.startsWith("error:", 1)) {
            alert(Response.slice(7, Response.length - 1));
          } else {
            this.setState({ spin: false });
            localStorage.setItem("Object", Response);
          }
        }
      );
    } else {
      alert("Connection string cannot be empty");
      this.setState({ spin: false });
    }
    this.setState({ selectedTables: [] });
  };
  public inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ connectionString: event.target.value });
  };

  public inptContextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Context: event.target.value });
  };


  tableSelect = (event: ChangeEvent<HTMLInputElement>) => {
    event.persist();
    if (event.target.checked) {
      this.setState((prevState) => {
        const arr = prevState.selectedTables;
        return {
          selectedTables: [...arr, event.target.id],
        };
      });
    } else {
      this.setState((prevState) => {
        const arr = prevState.selectedTables;
        arr.splice(arr.indexOf(event.target.id), 1);

        return {
          selectedTables: arr,
        };
      });
    }
  };

  public render() {
    return (
      <Container className="ConnectionConteiner">
        <Row>
          <Col>
            <Input
              className="connectionComponent"
              onChange={this.inptOnChange}
              type="text"
              placeholder="input connection string"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Input
              className="connectionComponentContext"
              type="text"
              placeholder="input context name"
              onChange={this.inptContextOnChange}
            />
            {this.state.spin ? <Spinner color="success"></Spinner> : null}
          </Col>
        </Row>
        <Row>
          <Col>
            <label className={"checker"}>
              <Input type="checkbox" onClick={this.checkClick} /> Check me out
            </label>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="connectionComponentBTN"
              color="success"
              onClick={this.btnOnClickModelGenerate}
            >
              Generate Models
            </Button>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={"SelectTable"}
        >
          <ModalHeader toggle={this.toggle}>Select Tables</ModalHeader>
          <ModalBody>
            <ul>
              {this.state?.tables.map((item) => (
                <li key={item}>
                  <Input
                    type="checkbox"
                    onChange={this.tableSelect}
                    id={item}
                  ></Input>
                  <p>{item}</p>
                </li>
              )) ?? "Tables not found"}
            </ul>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.doSomthing}>
              Generate model
            </Button>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}
