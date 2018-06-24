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

const HOVER_TEXT = {
    ESTIMATED_EARNINGS: `
        Here is the fun part, after we ensure the accuracy of your data we will
        predict how much money you will make with Cake.
    `,
    LOAN_PAPERWORK: `
        We can't draft your specific loan paperwork until all of the previous steps are completed.
        You can see an example cake loan agreement with generic details ***somewhere***
    `,
    NONE: null
}

const STEP_ICON = { NUMBER: 'number', LOCK: 'lock' };

const STEPS_CONFIG_WELCOME = [
    [ WALKTHROUGH.PERSONAL_DETAILS, 'step-personal-details', 'Personal Information', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BROKERAGE_ACCESS, 'step-brokerage-access', 'Brokerage Access', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BANK_DETAILS, 'step-bank-details', 'Bank Details', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.ESTIMATED_EARNINGS, 'step-estimated-earnings', 'Estimated Earnings', HOVER_TEXT.ESTIMATED_EARNINGS, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.LOAN_PAPERWORK, 'step-loan-paperwork', 'Load Paperwork', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
];

const STEPS_CONFIG_DEFAULT = [
    [ WALKTHROUGH.PERSONAL_DETAILS, 'step-personal-details', 'Personal Information', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BROKERAGE_ACCESS, 'step-brokerage-access', 'Brokerage Access', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BANK_DETAILS, 'step-bank-details', 'Bank Details', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.ESTIMATED_EARNINGS, 'step-estimated-earnings', 'Estimated Earnings', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.LOAN_PAPERWORK, 'step-loan-paperwork', 'Loan Paperwork', HOVER_TEXT.LOAN_PAPERWORK, STEP_ICON.LOCK ],
];

const StepsIcon = ({ stepClassName, ...props }) => {
    return (
        <div {...props} className={`steps-header-icon ${stepClassName}`}></div>
    );
};

const CheckStyle = {
    color: '#1DBA1D',
    opacity: '1',
    marginLeft: '1px',
    marginTop: '-3px',
    fontSize: '22px',
}

const LockStyle = {
    fontSize: '22px',
    opacity: '1',
    color: '#7F7F7F'
};

const Lock = ({check, ...props}) => {
    return (
        <span {...props} className="fa-layers fa-fw lock-container" >
            <i className="fas fa-lock" style={LockStyle}></i>
            { check ? <i className="fas fa-check" style={CheckStyle}></i> : null }
        </span>
    );
};

const mapIndexed = R.addIndex(R.map);

export default class StepsHeader extends Component {
    renderStepIcon(stepIconType, highlighted, idx) {
        if (stepIconType === STEP_ICON.NUMBER) {
            return (
                <div className={`number-circle ${highlighted ? 'highlighted-number-circle' : ''}`}>
                    {`${idx + 1}`}
                </div>
            );
        } else {
            return <Lock />;
        }
    }

    renderBody() {
        const highlightedSteps = this.props.highlightedSteps || [];
        const stepsConfig = this.props.stepsVersion === 'welcome' ? STEPS_CONFIG_WELCOME : STEPS_CONFIG_DEFAULT;

        return (
            <div className="steps-header-container">
                <Steps current={-1}>
                    {
                        mapIndexed((val, idx) => {
                            const [
                                stepName,
                                stepClassName,
                                stepDescriptionText,
                                stepHoverState,
                                stepIconType
                            ] = val;

                            const title = <StepsIcon stepClassName={stepClassName}/>;
                            const highlighted = R.contains(stepName, highlightedSteps);
                            let stepIcon = this.renderStepIcon(stepIconType, highlighted, idx);

                            if (stepHoverState) {
                                const tooltip = (
                                    <Tooltip id={`steps-header-step-tooltip-${idx}`} className="steps-tooltip">
                                        { stepHoverState }
                                    </Tooltip>
                                );

                                stepIcon = (
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={tooltip}
                                        >
                                        { stepIcon }
                                    </OverlayTrigger>
                                );
                            }

                            const description = (
                                <Fragment>
                                    { stepIcon }
                                    <div className={`description-text ${highlighted ? 'highlighted-description-text' : ''}`}>
                                        {stepDescriptionText}
                                    </div>
                                </Fragment>
                            );

                            return (
                                <Step key={idx} description={description} title={title}/>
                            );
                        }, stepsConfig)
                    }
                </Steps>
            </div>
        );
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs={8} xsOffset={2}>
                        { this.renderBody() }
                    </Col>
                </Row>
            </Grid>
        );
    }
}