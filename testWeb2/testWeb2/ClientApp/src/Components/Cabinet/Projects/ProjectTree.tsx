import React, { Props } from "react";

import "./ProjectInfo.css";

interface state {
  width: string;
}
class ProjectTree extends React.Component<{}, state> {
  constructor(prop: state) {
    super(prop);
    this.state = {
      width: "1600"
    };
  }

  render() {
    let object = JSON.parse(localStorage?.getItem("Object") ?? "");
    console.log(this.state.width);
    return (
      <div className="FileTree">
        <h3>FileTree</h3>
        <div className="tree" >
          {object.models.map((item: any) => (
            <textarea cols={50} rows={15} className={"ModelRecord"}>
              {item}
            </textarea>
          ))}
        </div>
      </div>
    );
  }
}
export default ProjectTree;
