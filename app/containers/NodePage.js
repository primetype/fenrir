// @flow
import React, { Component } from 'react';
import Node from '../components/Node';

type Props = { location: Object };

export default class NodePage extends Component<Props> {
  props: Props;

  render() {
    const { location } = this.props;

    let nodeAddress = '';
    if (location.state === undefined) {
      // TODO change location
      console.error('no location settings, redirect to the main page');
    } else {
      nodeAddress = location.state.address;
    }

    return <Node nodeAddress={nodeAddress} />;
  }
}
