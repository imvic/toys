import * as React from "react";
import * as ReactDOM from "react-dom";

const ModeQuestion = 0;
const ModeAnswer = 1;

class MMathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: ModeQuestion,
      op1: this.genNum(),
      op2: this.genNum(),
      value: 0
    };
    this.genNum = this.genNum.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  genNum() {
    return Math.floor(Math.random() * this.props.product, 10);
  }

  onChange(event) {
    this.setState({ value: event.target.value });
  }

  onSubmit(event) {
    this.setState({ mode: ModeAnswer });
  }

  onRefresh() {
    this.setState({
      mode: ModeQuestion,
      op1: this.genNum(),
      op2: this.genNum()
    });
  }

  render() {
    const button =
      this.state.mode === ModeQuestion ? (
        <button onClick={this.onSubmit}>Submit</button>
      ) : (
        <button onClick={this.onRefresh}>Refresh</button>
      );
    const answer =
      this.state.mode === ModeAnswer
        ? `Yours: ${this.state.value} Answer: ${this.state.op1 +
            this.state.op2}`
        : "";
    return (
      <div>
        <h3>{`${this.state.op1} + ${this.state.op2}`}</h3>
        <input value={this.state.value} onChange={this.onChange} />
        {button}
        <div>{answer}</div>
      </div>
    );
  }
}

MMathPanel.defaultProps = {
  product: 100
};

ReactDOM.render(<MMathPanel product={1000} />, document.getElementById("app"));
