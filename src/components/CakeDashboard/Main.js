import React, { Component, Fragment } from 'react';
import { Alert } from 'react-bootstrap';

import LoadingSpinner from '../LoadingSpinner';
import EstimatedCakeEarnings from './EstimatedCakeEarnings';

import './Main.css';
/*
import BankAccountInfo from './BankAccountInfo';
import BrokerageCredentials from './BrokerageCredentials';
*/

import { fetchUserDashboardData } from '../../libs/userState';

export default class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingUserDashboardData: true,
            userDashboardData: null,
            errorLoadingDashboardData: false
        };
    }

    async componentDidMount() {
        try {
            const userDashboardData = await fetchUserDashboardData({ force: true });
            this.setState({ userDashboardData, isLoadingUserDashboardData: false });
        } catch (e) {
            this.setState({ isLoadingUserDashboardData: false, errorLoadingDashboardData: true });
        }
    }

    renderInitialLoading = () => {
        return (
            <LoadingSpinner bsSize='large' text='Loading your dashboard...' />
        );
    }

    renderMainDashboard() {
        if (this.state.errorLoadingDashboardData) {
            return (
                <Alert bsStyle='danger' className='center-text'>
                    <strong>There was an issue loading the page! Please try again in a bit, or contact us for support</strong>
                </Alert>
            );
        }

        return (
            <Fragment>
                <EstimatedCakeEarnings
                    estimated2017Earnings={this.state.userDashboardData['estimated 2017 earnings']}
                    enrollmentPeriod={this.state.userDashboardData['Enrollment Period']}
                />
            </Fragment>
        );
    }

    getRenderBody() {
        if (this.state.isLoadingUserDashboardData) {
            return this.renderInitialLoading();
        } else {
            return this.renderMainDashboard();
        }
    }

    render() {
        return (
            <div className='cake-dashboard-main'>
                { this.getRenderBody() }
            </div>
        );
    }
}