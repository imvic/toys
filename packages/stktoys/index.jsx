import * as React from "react";
import * as ReactDOM from "react-dom";

import { txConfigs } from "./configs";

const qqqDropQuantiles = [
  [0.1, 0.0],
  [0.2, 0.093],
  [0.3, 0.243],
  [0.4, 0.294],
  [0.5, 0.52],
  [0.6, 0.583],
  [0.61, 0.61],
  [0.63, 0.671],
  [0.666, 0.779],
  [0.7, 1.118],
  [0.8, 1.379],
  [0.9, 2.798],
  [1, 5.691],
];

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      txs: [{ price: "", count: "" }],
      exit: {
        price: 0,
        count: 0,
      },
      target: 0,
      min: 1,
      max: 30,
      quantiles: [],

      pwd: "",

      interval: {
        start: 0,
        end: 0,
        count: 0,
      },

      monthStats: {
        lastLowest: "",
        thisStart: "",
      },

      config: undefined,
    };
    this.pwd = "st";

    this.onChangeCount = this.onChangeCount.bind(this);
    this.onAddTx = this.onAddTx.bind(this);
    this.onDelTx = this.onDelTx.bind(this);
    this.onChangeExitPrice = this.onChangeExitPrice.bind(this);
    this.onChangeExitCount = this.onChangeExitCount.bind(this);
    this.onChangeTarget = this.onChangeTarget.bind(this);

    cookieStore.get("p").then((cookie) => {
      this.setState({
        pwd: cookie != null && cookie.value,
      });
    });
  }

  onChangePrice = (id, strVal) => {
    const newTx = { count: this.state.txs[id].count, price: strVal };
    const newTxs = [
      ...this.state.txs.slice(0, id),
      newTx,
      ...this.state.txs.slice(id + 1),
    ];

    this.setState({ txs: newTxs });
  };

  onChangeCount(id, strVal) {
    const newTx = { price: this.state.txs[id].price, count: strVal };
    const newTxs = [
      ...this.state.txs.slice(0, id),
      newTx,
      ...this.state.txs.slice(id + 1),
    ];

    this.setState({ txs: newTxs });
  }

  onAddTx() {
    this.setState({
      txs: [...this.state.txs, { price: "", count: "" }],
    });
  }

  onDelTx() {
    this.setState({
      txs: this.state.txs.slice(0, this.state.txs.length - 1),
    });
  }

  onChangeExitPrice(e) {
    let price = 0.0;
    try {
      price = parseFloat(e.target.value).toFixed(2);
    } catch (e) {
      price = 0;
    }

    this.setState({
      exit: {
        price,
        count: this.state.exit.count,
      },
    });
  }

  onChangeExitCount(e) {
    const count = parseInt(e.target.value);
    this.setState({
      exit: {
        price: this.state.exit.price,
        count,
      },
    });
  }

  onChangeTarget(e) {
    const target = parseFloat(e.target.value).toFixed(2);

    const quantileList = this.calculateQuantiles(
      target,
      this.state.min,
      this.state.max,
    );
    this.setState({
      target,
      quantiles: quantileList,
    });
  }

  calculateQuantiles = (target, min, max) => {
    let quantiles = [];
    for (let i = min; i <= max; i++) {
      quantiles = [...quantiles, i];
    }

    const reverseQuantiles = quantiles.map((quantile) => quantile * -1);
    const allQuantiles = [...reverseQuantiles, ...quantiles];
    const quantileList = allQuantiles.map((quantile) => {
      return {
        name: quantile,
        value: (((quantile + 100.0) / 100.0) * target).toFixed(2),
      };
    });

    return quantileList;
  };

  onChangeMin = (e) => {
    const min = parseInt(e.target.value);

    const quantileList = this.calculateQuantiles(
      this.state.target,
      min,
      this.state.max,
    );
    this.setState({
      min,
      quantiles: quantileList,
    });
  };

  onChangeMax = (e) => {
    const max = parseInt(e.target.value);
    const quantileList = this.calculateQuantiles(
      this.state.target,
      this.state.min,
      max,
    );
    this.setState({
      max,
      quantiles: quantileList,
    });
  };

  onChangePwd = (e) => {
    cookieStore.set({
      name: "p",
      value: e.target.value,
      expires: Date.now() + 86400000000, // 24 hours
    });

    this.setState({
      pwd: e.target.value,
    });
  };

  onChangeStart = (e) => {
    const start = parseInt(e.target.value);
    this.setState({
      interval: {
        ...this.state.interval,
        start,
      },
    });
  };

  onChangeEnd = (e) => {
    const end = parseInt(e.target.value);
    this.setState({
      interval: {
        ...this.state.interval,
        end,
      },
    });
  };

  onChangePointCount = (e) => {
    const pointCount = parseInt(e.target.value);
    const start = this.state.interval.start;
    const end = this.state.interval.end;

    const txs = this.calculateTxs(pointCount, start, end);

    this.setState({
      interval: {
        ...this.state.interval,
        count: pointCount,
      },
      txs,
    });
  };

  calculateTxs = (count, start, end) => {
    const interval = end - start;
    const incr = interval / count;

    let txs = [];
    for (let i = 0; i < count + 1; i++) {
      const price = start + i * incr;
      txs = [...txs, { price: `${price.toFixed(2)}`, count: 0 }];
    }

    return txs;
  };

  onChangeConfig = (config) => {
    const target = this.state.target;
    const txs = config.txs.map((txConfig) => {
      return {
        price: ((100 - txConfig.quantile) / 100) * target,
        count: txConfig.count,
      };
    });

    this.setState({
      config: config.name,
      txs,
    });
  };

  onChangeLastLowest = (e) => {
    this.setState({
      monthStats: {
        ...this.state.monthStats,
        lastLowest: e.target.value,
      },
    });
  };

  onChangeThisStart = (e) => {
    this.setState({
      monthStats: {
        ...this.state.monthStats,
        thisStart: e.target.value,
      },
    });
  };

  render() {
    let avgPrice = 0.0;
    let acc = 0;
    let accLoss = 0;

    const txRows = this.state.txs.map((tx, id) => {
      const price = tx.price ? parseFloat(tx.price) : 0;
      const count = tx.count ? parseInt(tx.count) : 0;

      const newAcc = acc + count;
      const newTotal =
        count >= 0 ? avgPrice * acc + price * count : avgPrice * (acc + count);
      const newAvg =
        newAcc !== 0 ? (count >= 0 ? newTotal / newAcc : avgPrice) : 0;
      const loss = count < 0 ? -count * (price - avgPrice) : 0;
      const pos = this.state.target
        ? (price - this.state.target) / this.state.target
        : 0;

      avgPrice = newAvg;
      acc = newAcc;

      console.log(tx);

      return (
        <div key={`panel-${id}`}>
          <input
            placeholder="Price"
            type="text"
            value={tx.price}
            onChange={(e) => {
              this.onChangePrice(id, e.target.value);
            }}
          ></input>
          <input
            placeholder="Count"
            type="text"
            value={tx.count}
            onChange={(e) => {
              this.onChangeCount(id, e.target.value);
            }}
          ></input>
          <div className="result">
            {`${pos ? (pos * 100).toFixed(1) : 0}% ___ ${newAcc} ___ ${newAvg ? newAvg.toFixed(2) : 0} ___ ${newTotal ? newTotal.toFixed(2) : 0} ___ ${loss ? (loss * -1).toFixed(2) : 0}`}
          </div>
        </div>
      );
    });

    const txDetails = this.state.txs.map((tx, id) => {
      const price = tx.price ? parseFloat(tx.price) : 0;
      const count = tx.count ? parseInt(tx.count) : 0;

      const newAcc = acc + count;
      const newTotal = avgPrice * acc + price * count;
      const newAvg = newAcc !== 0 ? newTotal / newAcc : 0;
      const loss = count < 0 ? count * (price - avgPrice) : 0;

      accLoss += loss;

      avgPrice = newAvg;
      acc = newAcc;

      return (
        <tr id={`${id}`}>
          <tc>{` ${newAcc} ___   `}</tc>
          <tc>{` ${newAvg.toFixed(2)} ___ `}</tc>
          <tc>{` ${newTotal.toFixed(2)} ___ `}</tc>
          <tc>{` ${loss.toFixed(2)} ___ `}</tc>
        </tr>
      );
    });

    let hold = 0;
    let totalCount = 0;
    let maxPrice = 0.0;
    this.state.txs.forEach((tx) => {
      const price = tx.price ? parseFloat(tx.price) : 0;
      const count = tx.count ? parseInt(tx.count) : 0;

      hold += price * count;
      totalCount += count;
      if (price - maxPrice > 0) {
        maxPrice = price;
      }
    });
    hold = hold.toFixed(2);

    const priceAvg = (hold / totalCount).toFixed(2);
    const sold = (this.state.exit.price * this.state.exit.count).toFixed(2);
    const gain = (
      (this.state.exit.price - priceAvg) *
      this.state.exit.count
    ).toFixed(2);
    const leftCount = totalCount - this.state.exit.count;
    const leftValue = (priceAvg * leftCount).toFixed(2);
    const interval = (
      ((this.state.exit.price - maxPrice) / maxPrice) *
      100
    ).toFixed(2);

    const quantileListPos = this.state.quantiles
      .filter((q) => q.name >= 0)
      .map((quantile) => {
        return <span>{`${quantile.name}=${quantile.value}, `}</span>;
      });

    const quantileListNeg = this.state.quantiles
      .filter((q) => q.name < 0)
      .map((quantile) => {
        return <span>{`${quantile.name}=${quantile.value}, `}</span>;
      });

    const configBtns = txConfigs.map((config) => {
      return (
        <button
          onClick={() => {
            this.onChangeConfig(config);
          }}
        >
          {config.name}
        </button>
      );
    });

    console.log(this.state);

    if (this.state.pwd !== this.pwd) {
      return (
        <input
          onChange={this.onChangePwd}
          placeholder={"unlock"}
          type="text"
        ></input>
      );
    }

    // month stats
    const thisStart = parseFloat(this.state.monthStats.thisStart);
    const dropValue = thisStart - parseFloat(this.state.monthStats.lastLowest);
    const dropContiles = qqqDropQuantiles.map((quantile) => {
      return (
        <div>{`${quantile[0]} = ${thisStart - dropValue * quantile[1]}`}</div>
      );
    });

    return (
      <div>
        <div>
          <input
            onChange={this.onChangeTarget}
            placeholder={"Target"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeMin}
            placeholder={"Min"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeMax}
            placeholder={"Max"}
            type="text"
          ></input>

          <div className="result">{quantileListPos}</div>
          <div className="result">{quantileListNeg}</div>
        </div>

        <hr />

        <div>
          <input
            onChange={this.onChangeLastLowest}
            placeholder={"Last Lowest"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeThisStart}
            placeholder={"This Start"}
            type="text"
          ></input>

          <div className="result">
            <div>deadline quantiles</div>
            {dropContiles}
          </div>
        </div>

        <hr />

        <div>
          <input
            onChange={this.onChangeStart}
            placeholder={"Start"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeEnd}
            placeholder={"End"}
            type="text"
          ></input>
          <input
            onChange={this.onChangePointCount}
            placeholder={"PointCount"}
            type="text"
          ></input>

          <div>{configBtns}</div>
        </div>

        <hr />

        {this.state.exit.count > totalCount && (
          <div id="alert">Too much sold</div>
        )}

        {txRows}
        <div>
          <button onClick={this.onAddTx}>AddTx</button>
          <button onClick={this.onDelTx}>DelTx</button>
        </div>
        <div>
          <input
            onChange={this.onChangeExitPrice}
            placeholder={"ExitPrice"}
            type="text"
          ></input>
          <input
            onChange={this.onChangeExitCount}
            placeholder={"ExitCount"}
            type="text"
          ></input>
        </div>
        <div className="result">
          <table>
            {txDetails}
            <tr>
              {`  ___ `}
              {`  ___ `}
              {`  ___ `}
              <tc>{`  ${accLoss.toFixed(2)} ___ `}</tc>
            </tr>
          </table>
        </div>
        <div className="result">
          <div>{`Pre: ${hold} = ${priceAvg} x ${totalCount}`}</div>
          <div>{`Sold: ${sold} (${((sold / hold) * 100).toFixed(2)}%) = ${this.state.exit.price} x ${this.state.exit.count}`}</div>
          <div>{`Gain: ${gain} (${((gain / sold) * 100).toFixed(2)}%) = ${(this.state.exit.price - priceAvg).toFixed(2)} x ${this.state.exit.count}`}</div>
          <div>{`Post: ${leftValue} (${interval}%) = ${priceAvg} x  ${leftCount}`}</div>
        </div>
      </div>
    );
  }
}

App.defaultProps = {};

ReactDOM.render(<App />, document.getElementById("app"));
