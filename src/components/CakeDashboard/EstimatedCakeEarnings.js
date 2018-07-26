import React from 'react';
import * as R from 'ramda';

import './EstimatedCakeEarnings.css';

const formatDollars = (dollars) => `$${(dollars).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;

const ENROLLMENT_PERIOD_DIVISORS = {
    '1 Months': 12,
    '2 Months': 6,
    '3 Months': 4,
    '6 Months': 2,
    '12 Months': 1,
};

const EstimatedCakeEarnings = ({ estimated2017Earnings, enrollmentPeriod }) => {
    if (R.isNil(estimated2017Earnings) || estimated2017Earnings === '0') {
        return null;
    }

    const parsedEstimated2017Earnings = parseFloat(estimated2017Earnings);
    const estimated2017EarningsDollars = formatDollars(parsedEstimated2017Earnings);

    const cakePayout = parsedEstimated2017Earnings / (ENROLLMENT_PERIOD_DIVISORS[enrollmentPeriod] || 1);
    const cakePayoutsDollars = formatDollars(cakePayout);

    return (
        <div className='estimated-cake-earnings dashboard-data-container centered-text'>
            <h2>CAKE ESTIMATED EARNINGS</h2>
            <div className='text'> Last year you would have made: </div>
            <div className='yearly-earnings'>{ estimated2017EarningsDollars }</div>
            <div className='text'>, for an average Cake payout of <span className='cake-payouts'>{ cakePayoutsDollars }</span></div>
            <br />
            <br />
        </div>
    );
};

export default EstimatedCakeEarnings;