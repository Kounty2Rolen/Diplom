import React from "react";
import {
  Button,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
import { serialize } from "v8";
import CodeServices from "../Services/CodeServices";

interface state {
  CodeResult: string;
  text: string;
  connectionString: string;
  Context: string;
  spin: boolean;
  modal: boolean;
  check: boolean;
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
      check: true
    };
  }

  public checkClick = () => {
    this.setState(prevState => {
      return {
        check: !prevState.check
      };
    });
  };
  public toggle = () => {
    this.setState(prevState => {
      return {
        modal: !prevState.modal
      };
    });
  };
  doSomthing = () => {
    this.GenerateModel();
    this.toggle;
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
      ProjName: this.props.ProjName
    };
    if (
      this.state.connectionString.length > 0 &&
      this.state.Context.length > 0
    ) {
      CodeServices.ModelGenerateService(ConectionData).then(
        (Response: string) => {
          this.setState({ spin: false });
          localStorage.setItem("AnonymObject", Response);
        }
      );
    } else {
      alert("Строка подключения не может быть пустой");
      this.setState({ spin: false });
    }
  };
  public inptOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ connectionString: event.target.value });
  };

  public inptContextOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ Context: event.target.value });
  };

  public render() {
    return (
      <div className="ConnectionConteiner">
        <Input
          className="connectionComponent"
          onChange={this.inptOnChange}
          type="text"
          placeholder="input connection string"
        />
        <br />
        <Input
          className="connectionComponentContext"
          type="text"
          placeholder="input context name"
          onChange={this.inptContextOnChange}
        />
        {this.state.spin ? <Spinner color="success"></Spinner> : null}
        <br />
        <div className={"ButtonsDiv"}>
          <label className={"checker"}>
            <Input type="checkbox" onClick={this.checkClick} /> Check me out
          </label>
          <br />
          <Button
            className="connectionComponentBTN"
            color="success"
            onClick={this.btnOnClickModelGenerate}
          >
            Generate Models
          </Button>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={"SelectTable"}
        >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.doSomthing}>
              Do Something
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
