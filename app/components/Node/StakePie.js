// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import Loading from '../Loading';
import ReactSvgPieChart from "react-svg-piechart"

type Props = {
  nodeAddress: string
};

type Pool = {
  poolId: string,
  stake: number,
}

type Stake = {
  dangling: number,
  pools: [Pool],
  unassigned: number,
};

type StakeState = {
  epoch: number,
  stake: Stake,
};

type State = {
  loaded: boolean,
  stakeState: StakeState,
  dataIndex: number,
};

const computeTotalStake = (stake: Stake) => {
  let totalStake: number = stake.dangling;
  console.log(stake);
  console.log(totalStake);

  stake.pools.forEach(pool => {
    totalStake += pool.stake;
  });

  console.log(totalStake);


  return {
    totalStake: totalStake,
    totalValue: totalStake + stake.unassigned,
  }
};

const computeToPieData = (stake: Stake) => {
  let data = [
    {title: "unassigned", value: stake.unassigned, color: "#22594e"},
    {title: "dangling", value: stake.dangling, color: "#2f7d6d"},
  ];

  let color = 0;

  stake.pools.forEach(pool => {
    color += 1;
    data.push({
      title: pool.poolId,
      value: pool.stake,
      color: '#5' + color + "afcc"
    });
  });

  return data;
};

export default class LeaderSchedules extends Component<Props, State> {
  props: Props;

  state: State = {
    loaded: false,
    stakeState: null,
    dataIndex: null,
  };

  loadSchedules = () => {
    const Http = new XMLHttpRequest();
    const url = this.props.nodeAddress + '/api/v0/stake';
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      if (Http.responseText.length === 0) {
        return;
      }
      let stakeState = JSON.parse(Http.responseText);

      stakeState.stake.pools = stakeState.stake.pools.map((pool) => {
        return {
          poolId: pool[0],
          stake: pool[1],
        };
      });

      this.setState({ loaded: true, stakeState: stakeState });
    }
  }

  componentDidMount() {
    if (this.state.loaded === false) {
      this.loadSchedules();
    }
  }

  renderInfo() {
    console.log(this.state);

    if (this.state.dataIndex === null || this.state.dataIndex === undefined) {
      const { totalStake, totalValue } = computeTotalStake(this.state.stakeState.stake);

      return (
        <div>
          <p>Total Value: {totalValue}</p>
          <p>Total Stake: {totalStake}</p>
        </div>
      );
    } else {
      const data = this.state.stakeState.stake.pools[this.state.dataIndex];

      return (
        <div>
          <p>{data.poolId}: {data.stake}</p>
        </div>
      );
    }
    return null;
  }

  onPieOver = (index: number) => {
    this.setState ({ dataIndex: index });
  };

  onPieLeave = () => {
    this.setState ({ dataIndex: null });
  };

  render() {
    const { loaded, stakeState } = this.state;

    if (loaded === false) {

      return (
        <div>
          Loading stake stake
          <Loading />
        </div>
      );
    } else {
      const epoch = stakeState.epoch;

      const data = computeToPieData(stakeState.stake);

      return (
        <div className="card bg-dark">
          <div className="card-header">
            <span className="badge badge-light">{epoch}</span>
            &nbsp;Stake State
            <span className="float-right">
              <button className="btn btn-primary" data-tip="Check for more logs" onClick={this.loadSchedules}>
                <i className="fa fa-redo" />
                <ReactToolTip />
              </button>
            </span>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                {this.renderInfo()}
              </div>
            </div>
            <div className="row">
              <div className="col">
                <ReactSvgPieChart
                  data={data}
                  expandOnHover
                  onSectorHover={(d, i, e) => {
                    if (d) {
                      this.onPieOver(i);
                    } else {
                      this.onPieLeave();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}


const data = [
  {title: "Data 1", value: 100, color: "#22594e"},
  {title: "Data 2", value: 60, color: "#2f7d6d"},
  {title: "Data 3", value: 30, color: "#3da18d"},
  {title: "Data 4", value: 20, color: "#69c2b0"},
  {title: "Data 5", value: 10, color: "#a1d9ce"},
]

const MyCompo = () => (
  <ReactSvgPieChart
    data={data}
    // If you need expand on hover (or touch) effect
    expandOnHover
    // If you need custom behavior when sector is hovered (or touched)
    onSectorHover={(d, i, e) => {
      if (d) {
        console.log("Mouse enter - Index:", i, "Data:", d, "Event:", e)
      } else {
        console.log("Mouse leave - Index:", i, "Event:", e)
      }
    }}
  />
)
