import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, { Component, Fragment } from "react";
import ReactDOM from 'react-dom';
import Steps, { Step } from 'rc-steps';
import * as R from "ramda";
import { Grid, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import "./StepsHeader.css";
import { userStateActions } from "../../libs/userState";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

const ESTIMATED_EARNINGS_HOVER_TEXT = `
    Here is the fun part, after we ensure the accuracy of your data we will
    predict how much money you will make with Cake.
`;

const STEPS_CONFIG = [
    [ WALKTHROUGH.PERSONAL_DETAILS, 'step-personal-details', 'Personal Information' ],
    [ WALKTHROUGH.BROKERAGE_ACCESS, 'step-brokerage-access', 'Brokerage Access' ],
    [ WALKTHROUGH.BANK_DETAILS, 'step-bank-details', 'Bank Details' ],
    [ WALKTHROUGH.ESTIMATED_EARNINGS, 'step-estimated-earnings', 'Estimated Earnings', ESTIMATED_EARNINGS_HOVER_TEXT ],
    [ WALKTHROUGH.LOAN_PAPERWORK, 'step-loan-paperwork', 'Load Paperwork' ],
];

const StepsIcon = ({ stepClassName, ...props }) => {
    return (
        <div {...props} className={`steps-header-icon ${stepClassName}`}></div>
    );
};

const mapIndexed = R.addIndex(R.map);

export default class StepsHeader extends Component {
    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={8} xsOffset={2}>
                        <div className="steps-header-container">
                            <Steps current={2} status="error">
                                {
                                    mapIndexed((val, idx) => {
                                        const [stepClassName, stepDescriptionText, stepHoverState] = R.tail(val);

                                        const title = <StepsIcon stepClassName={stepClassName}/>;

                                        let numberCircle = <div className="number-circle">{`${idx + 1}`}</div>;

                                        if (stepHoverState) {
                                            const tooltip = (
                                                <Tooltip id={`steps-header-step-tooltip-${idx}`} className="steps-tooltip">
                                                    { stepHoverState }
                                                </Tooltip>
                                            );

                                            numberCircle = (
                                                <OverlayTrigger
                                                    placement="right"
                                                    overlay={tooltip}
                                                    >
                                                    { numberCircle }
                                                </OverlayTrigger>
                                            );
                                        }

                                        const description = (
                                            <Fragment>
                                                { numberCircle }
                                                <div className="description-text">{stepDescriptionText}</div>
                                            </Fragment>
                                        );

                                        return (
                                            <Step key={idx} description={description} title={title}/>
                                        );
                                    }, STEPS_CONFIG)
                                }
                            </Steps>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}