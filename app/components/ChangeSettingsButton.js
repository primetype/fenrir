// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactToolTip from 'react-tooltip';
import routes from '../constants/routes';

type Props = {};

export default class ChangeSettingsButton extends Component<Props> {
  props: Props;

  render() {
    return (
      <Link
        to={routes.HOME}
        className="badge badge-pill badge-primary"
        data-tip="Change Node connection settings"
      >
        <i className="fa fa-cogs fa-2x" />
        <ReactToolTip />
      </Link>
    );
  }
}
