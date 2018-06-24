import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, { Component, Fragment } from "react";
import ReactDOM from 'react-dom';
import Steps, { Step } from 'rc-steps';
import * as R from "ramda";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
    [ WALKTHROUGH.LOAN_PAPERWORK, 'step-loan-paperwork', 'Loan Paperwork', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
];

export const STEPS_CONFIG_DEFAULT = [
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

const Lock = ({check, ...props}) => {
    const LockCheckStyle = {
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

    return (
        <span {...props} className="fa-layers fa-fw lock-container" >
            <i className="fas fa-lock" style={LockStyle}></i>
            { check ? <i className="fas fa-check" style={LockCheckStyle}></i> : null }
        </span>
    );
};

const mapIndexed = R.addIndex(R.map);

const NumberCircle = ({text, highlighted, ...props}) => {
    return (
        <div {...props} className={`number-circle ${highlighted ? 'highlighted-number-circle' : ''}`}>
            { text }
        </div>
    );
}

const CompletedCircle = ({...props}) => {
    const CircleCheckStyle = {
        color: '#1DBA1D',
        opacity: '1',
        marginLeft: '4px',
        marginTop: '-3px',
        fontSize: '20px',
    }

    const CircleStyle = {
        fontSize: '24px',
        marginTop: '-4px',
        opacity: '1',
        color: '#85D0BC'
    };

    return (
        <span {...props} className="fa-layers fa-fw lock-container" >
            <i className="far fa-circle" style={CircleStyle}></i>
            <i className="fas fa-check" style={CircleCheckStyle}></i>
        </span>
    );
}

export const STEPS_HEADER_VERSIONS = {
    DEFAULT: 'DEFAULT',
    WELCOME: 'WELCOME',
}

export default class StepsHeader extends Component {
    renderStepIcon(stepIconType, highlighted, completed, idx) {
        if (completed) {
            return <CompletedCircle />;
        } else if (stepIconType === STEP_ICON.NUMBER || highlighted) {
            return <NumberCircle text={ `${idx + 1}` } highlighted={ highlighted } />;
        } else {
            return <Lock />;
        }
    }

    render() {
        const highlightedSteps = this.props.highlightedSteps || [ ];
        const completedSteps = this.props.completedSteps || [ ];
        const stepsConfig = this.props.stepsVersion === STEPS_HEADER_VERSIONS.WELCOME ? STEPS_CONFIG_WELCOME : STEPS_CONFIG_DEFAULT;

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

                            const title = <StepsIcon stepClassName={ stepClassName }/>;
                            const highlighted = R.contains(stepName, highlightedSteps);
                            const completed = R.contains(stepName, completedSteps);
                            let stepIcon = this.renderStepIcon(stepIconType, highlighted, completed, idx);

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
}