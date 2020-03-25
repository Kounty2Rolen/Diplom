import React from "react";
import { Home } from "./Home";
import "./Home.css";

interface props {
    currentPage: string;
}
export class Main extends React.Component<props> {
    public render() {
        switch (this.props.currentPage) {
            case "home":
                return <Home />;
                break;
            default:
                break;
        }
    }
}