import React, { Component, Fragment } from 'react';
import { Alert } from 'react-bootstrap';

import { EstimatedCakeEarnings, EstimatedCakeEarningsDefault } from './EstimatedCakeEarnings';
import LoadingSpinner from '../LoadingSpinner';
import TickerChart from './TickerChart';

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

    renderDataMissingDashboard() {
        return (
            <Fragment>
                <div className='center-text'>
                    <div className='purple-cake-text'>
                        <big>Welcome to your Cake dashboard! All of your data will populate after your analyst has reviewed your account details.</big>
                    </div>
                    <EstimatedCakeEarningsDefault />
                </div>
                <div className='dashboard-spacing' />
                <TickerChart stockTicker={null} />
            </Fragment>
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

        if (this.state.userDashboardData === null || this.state.userDashboardData.company === '') {
            return this.renderDataMissingDashboard();
        }

        return (
            <Fragment>
                <EstimatedCakeEarnings
                    estimated2017Earnings={this.state.userDashboardData['estimated 2017 earnings']}
                    enrollmentPeriod={this.state.userDashboardData['Enrollment Period']}
                />
                <div className='dashboard-spacing' />
                <TickerChart stockTicker={this.state.userDashboardData['Stock Ticker']} />
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