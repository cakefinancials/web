import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import './Home.css';

import DashboardContainer from '../components/DashboardContainer';

export default class Home extends Component {
  renderLander() {
    return <Redirect to="/login" />;
  }

  renderAuthedHome() {
    return <DashboardContainer />;
  }

  render() {
    return <div className="Home">{this.props.isAuthenticated ? this.renderAuthedHome() : this.renderLander()}</div>;
  }
}
