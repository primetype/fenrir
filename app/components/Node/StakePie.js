// @flow
import React, { Component } from 'react';
import ReactToolTip from 'react-tooltip';
import ReactSvgPieChart from 'react-svg-piechart';
import Loading from '../Loading';

type Props = {
  nodeAddress: string
};

type Pool = {
  poolId: string,
  stake: number
};

type Stake = {
  dangling: number,
  pools: [Pool],
  unassigned: number
};

type StakeState = {
  epoch: number,
  stake: Stake
};

type State = {
  loaded: boolean,
  stakeState: StakeState,
  dataIndex: number
};

const computeTotalStake = (stake: Stake) => {
  let totalStake: number = stake.dangling;
  stake.pools.forEach(pool => {
    totalStake += pool.stake;
  });

  return {
    totalStake,
    totalValue: totalStake + stake.unassigned
  };
};

const computeToPieData = (stake: Stake) => {
  const data = [
    { title: 'unassigned', value: stake.unassigned, color: '#22594e' },
    { title: 'dangling', value: stake.dangling, color: '#2f7d6d' }
  ];

  stake.pools.forEach(pool => {
    data.push({
      title: pool.poolId,
      value: pool.stake,
      color: '#4169E1'
    });
  });

  return data;
};

export default class LeaderSchedules extends Component<Props, State> {
  props: Props;

  state: State = {
    loaded: false,
    stakeState: null,
    dataIndex: null
  };

  componentDidMount() {
    const { loaded } = this.state;
    if (loaded === false) {
      this.loadSchedules();
    }
  }

  loadSchedules = () => {
    const { nodeAddress } = this.props;

    const Http = new XMLHttpRequest();
    const url = `${nodeAddress}/api/v0/stake`;
    Http.open('GET', url);
    Http.send();

    Http.onreadystatechange = () => {
      if (Http.responseText.length === 0) {
        return;
      }
      const stakeState = JSON.parse(Http.responseText);

      stakeState.stake.pools = stakeState.stake.pools.map(pool => {
        return {
          poolId: pool[0],
          stake: pool[1]
        };
      });

      this.setState({ loaded: true, stakeState });
    };
  };

  renderInfo() {
    const { dataIndex, stakeState } = this.state;
    if (dataIndex === null || dataIndex === undefined) {
      const { totalStake, totalValue } = computeTotalStake(stakeState.stake);

      return (
        <div>
          <p>Total Value: {totalValue}</p>
          <p>Total Stake: {totalStake}</p>
        </div>
      );
    }
    const index = dataIndex;
    const { stake } = stakeState;
    let data = { poolId: 'unassigned', stake: stake.unassigned };
    if (index === 0) {
      // DO NOTHING
    } else if (index === 1) {
      data = { poolId: 'dangling', stake: stake.dangling };
    } else {
      data = stake.pools[index - 2];
    }

    return (
      <div>
        <p>
          {data.poolId}: {data.stake}
        </p>
      </div>
    );
  }

  onPieOver = (index: number) => {
    this.setState({ dataIndex: index });
  };

  onPieLeave = () => {
    this.setState({ dataIndex: null });
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
    }

    const { epoch, stake } = stakeState;
    const data = computeToPieData(stake);

    return (
      <div className="card bg-dark">
        <div className="card-header">
          <span className="badge badge-light">{epoch}</span>
          &nbsp;Stake State
          <span className="float-right">
            <button
              type="button"
              className="btn btn-primary"
              data-tip="Check for more logs"
              onClick={this.loadSchedules}
            >
              <i className="fa fa-redo" />
              <ReactToolTip />
            </button>
          </span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col">{this.renderInfo()}</div>
          </div>
          <div className="row">
            <div className="col">
              <ReactSvgPieChart
                data={data}
                expandOnHover
                onSectorHover={(d, i) => {
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
