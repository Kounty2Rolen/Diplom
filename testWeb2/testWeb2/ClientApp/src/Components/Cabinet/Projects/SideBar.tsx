import React from "react";
import Sidebar from "react-sidebar";
import "./SideBar.css";
import { Link } from "react-router-dom";

interface state {
    sideBarState: boolean;
}

class sidebar extends React.Component<{}, state> {
    constructor(props: state) {
        super(props);
        this.state = {
            sideBarState: false
        };
    }
    onSetSidebarToogle = () => {
        this.setState({ sideBarState: !this.state.sideBarState });
        console.log(this.state.sideBarState);
    };
    render() {
        let proj = JSON.parse(localStorage?.getItem("Object") ?? '{"error":true}');

        return (
            <div>
                <Sidebar
                    overlayClassName="SideBarrOverlay"
                    rootClassName="SideBarRoot"
                    sidebar={
                        <div className="SideBarsItems">
                            <b>Database Models</b>
                            <br />
                            <br />

                            {proj.fileNames.map((item: string) => {
                                return (
                                    <p className="Rec">
                                        <Link to={"/Account/Projects/ModelEditor/" + item.split('.')[0]}>
                                            {item}
                                        </Link>
                                    </p>
                                );
                            })}
                        </div>
                    }
                    open={this.state.sideBarState}
                    onSetOpen={this.onSetSidebarToogle}
                    styles={{
                        sidebar: { background: "White", zIndex: "10", width: "15%" }
                    }}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Icons8_flat_folder.svg/600px-Icons8_flat_folder.svg.png"
                        className="Hamburger"
                        onClick={() => this.onSetSidebarToogle()}
                    />
                </Sidebar>
            </div>
        );
    }
}
export default sidebar;