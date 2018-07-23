import * as React from "react";
import * as ReactDOM from "react-dom";
import { MathPanel, styleInput } from "./math_panel";

class MMathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      colCount: 1
    };

    this.onChangeCol = this.onChangeCol.bind(this);
  }

  onChangeCol(event) {
    this.setState({ colCount: event.target.value });
  }

  render() {
    const colCountNum = Math.floor(Number(this.state.colCount));
    const mathPanels = Array.from(Array(colCountNum).keys()).map(id => (
      <MathPanel
        key={`panel-${id}`}
        style={{ width: `${Math.floor(100 / colCountNum)}%` }}
      />
    ));
    return (
      <div>
        <div>
          <input
            value={this.state.colCount}
            onChange={this.onChangeCol}
            style={styleInput}
          />
        </div>
        {mathPanels}
      </div>
    );
  }
}

MMathPanel.defaultProps = {};

ReactDOM.render(<MMathPanel />, document.getElementById("app"));
