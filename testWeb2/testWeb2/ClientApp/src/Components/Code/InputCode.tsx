import React from "react";
import ReactCodeMirror from "react-codemirror";
import { Button, Spinner, Container, Row, Col } from "reactstrap";
import "../../../node_modules/codemirror/lib/codemirror.css";
import "../../../node_modules/codemirror/mode/clike/clike";
import CodeService from "../../Services/CodeServices";
import "../Home.css";
import { Result } from "./ResultCode";
import * as SignalR from "@aspnet/signalr";

interface state {
    Result: {
        resultcode: string;
        sql: string;
    };
    SourceCode: string;
    connectionString: string;
    Context: string;
    Spin: boolean;
    model: string;
}
interface props {
    model: string;
}
export class InpCode extends React.Component<props, state> {
    constructor(props: props) {
        super(props);
        this.state = {
            Result: {
                resultcode: "Result:\n",
                sql: "SQL:\n"
            },
            SourceCode: "",
            connectionString: "",
            Context: "",
            Spin: false,
            model: ""
        };
    }
    hub = new SignalR.HubConnectionBuilder().withUrl("/rtt").build();

    componentDidMount() {
        this.hub.on("Result", (data: string) => {
            if (data === "True") {
                this.setState({ Spin: false });
            } else {
                this.setState(prevState => ({
                    Result: {
                        resultcode: this.state.Result.resultcode + data,
                        sql: this.state.Result.sql
                    }
                }));
                this.setState({ model: this.props.model });
            }
        });
        this.hub.on("Exception", (data: string) => {
            this.setState(prevState => ({
                Result: {
                    resultcode: "Compilation Error:\n" + data,
                    sql: this.state.Result.sql
                }
            }));
        });

        this.hub.on("SQL", (data: string) => {
            this.setState(prevState => ({
                Result: {
                    resultcode: this.state.Result.resultcode,
                    sql: this.state.Result.sql + data
                }
            }));

            console.log(this.state.Result);
        });
        this.hub.start();
    }
    public codeCompile = () => {
        let Code: object;
        this.setState({ Spin: true });
        if (sessionStorage.getItem("Token") !== null) {
            Code = {
                SourceCode: this.state.SourceCode,
                ContextName: document.getElementsByClassName(
                    "connectionComponentContext"
                )[0].nodeValue
                    ? document.getElementsByClassName("connectionComponentContext")[0]
                        .nodeValue
                    : "Context",
                serializeAnonProj: localStorage.getItem("Object")
            };
        } else {
            Code = {
                SourceCode: this.state.SourceCode,
                serializeAnonProj: localStorage.getItem("Object")
            };
        }
        if (this.state.SourceCode.length >= 0) {
            this.hub.send("Result", JSON.stringify(Code));
        } else if (this.state.connectionString.length > 0) {
            alert("Сперва подключитесь к бд");
        } else {
            alert("Поле с кодом не может быть пустым!");
        }
    };

    public txtAreaOnChange = (event: any) => {
        this.setState({ SourceCode: event });
    };
    public btnlock = () => {
        return this.state.Spin ? (
            <Button
                size="lg"
                className="btnConnect"
                color="danger"
                onClick={this.codeCompile}
                disabled
            >
                Submit
            </Button>
        ) : (
                <Button
                    size="lg"
                    className="btnConnect"
                    color="danger"
                    onClick={this.codeCompile}
                >
                    Submit
                </Button>
            );
    };
    public render() {
        const options = {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-csharp",
            value: this.props.model
        };

        return (
            <Container>
                <Row>
                    <ReactCodeMirror
                        onChange={this.txtAreaOnChange}
                        className="InputCode"
                        options={options}
                    ></ReactCodeMirror>
                </Row>
                <Row>
                    <Result Result={this.state.Result} />
                </Row>
                <Row xs="1">
                    <Col>
                        {this.btnlock()}
                        {this.state.Spin ? <Spinner color="danger"></Spinner> : null}
                    </Col>
                </Row>
            </Container>
        );
    }
}