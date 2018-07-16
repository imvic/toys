import * as React from "react";
import * as ReactDOM from "react-dom";

const ModeQuestion = 0;
const ModeAnswer = 1;

class MMathPanel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mode: ModeQuestion,
      value: 0,
      min: 0,
      max: 0,
      op1: 0,
      op2: 0
    };
    this.genNum = this.genNum.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onChangeMin = this.onChangeMin.bind(this);
    this.onChangeMax = this.onChangeMax.bind(this);
    this.setState({ op1: this.genNum(), op2: this.genNum() });
  }

  genNum() {
    return Math.floor(
      this.state.min + Math.random() * (this.state.max - this.state.min),
      10
    );
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

  onChangeMin(event) {
    this.setState({ min: Number(event.target.value) });
  }

  onChangeMax(event) {
    this.setState({ max: Number(event.target.value) });
  }

  render() {
    console.log(this.state.op1, this.state.op2);
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
        <input value={this.state.min} onChange={this.onChangeMin} />
        <input value={this.state.max} onChange={this.onChangeMax} />
        <input value={this.state.value} onChange={this.onChange} />
        {button}
        <div>{answer}</div>
      </div>
    );
  }
}

MMathPanel.defaultProps = {};

ReactDOM.render(<MMathPanel />, document.getElementById("app"));
