import React, { Component } from 'react';

import LoadingSpinner from './LoadingSpinner';
import Walkthrough from './AccountSetup/Walkthrough';
import Main from './CakeDashboard/Main';

import { subscribeUserStateChange, userStateActions } from '../libs/userState';

const {
  CONSTANTS: { WALKTHROUGH },
} = userStateActions;

export default class DashboardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingUserState: true,
      syncErrors: [],
      syncingUserState: false,
    };
  }

  async componentDidMount() {
    this.unsubscribeUserStateChange = subscribeUserStateChange(userStateUpdates => {
      this.setState(userStateUpdates);
    });
  }

  componentWillUnmount() {
    if (this.unsubscribeUserStateChange) {
      this.unsubscribeUserStateChange();
    }
  }

  renderInitialLoading = () => {
    return <LoadingSpinner bsSize="large" text="Picking up where we left off..." />;
  };

  renderSyncingUserState = () => {
    return <LoadingSpinner bsSize="large" text="Syncing with backend..." />;
  };

  renderCurrentDashboardStep() {
    const walkthroughStep = userStateActions.getWalkthroughStep();
    if (walkthroughStep !== WALKTHROUGH.DONE) {
      return <Walkthrough />;
    }

    return <Main />;
  }

  getRenderBody() {
    if (this.state.loadingUserState) {
      return this.renderInitialLoading();
    } else if (this.state.syncingUserState) {
      return this.renderSyncingUserState();
    } else {
      return this.renderCurrentDashboardStep();
    }
  }

  render() {
    return <div className="dashboard">{this.getRenderBody()}</div>;
  }
}
