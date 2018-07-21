import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import React, { Component, Fragment } from "react";
import Steps, { Step } from 'rc-steps';
import * as R from "ramda";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

import "./StepsHeader.css";
import "./StepsTooltip.css";
import Lock from "../helpers/Lock";

import { userStateActions } from "../../libs/userState";
const { CONSTANTS: { WALKTHROUGH } } = userStateActions;


const HOVER_TEXT = {
    ESTIMATED_EARNINGS: `
        Here is the fun part, after we ensure the accuracy of your data we will
        predict how much money you will make with Cake.
    `,
    NONE: null
}

const STEP_ICON = { NUMBER: 'number', LOCK: 'lock' };

export const STEPS_CONFIG_DEFAULT = [
    [ WALKTHROUGH.PERSONAL_DETAILS, 'step-personal-details', 'Personal Information', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BROKERAGE_ACCESS, 'step-brokerage-access', 'Brokerage Access', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.BANK_DETAILS, 'step-bank-details', 'Bank Details', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
    [ WALKTHROUGH.ESTIMATED_EARNINGS, 'step-estimated-earnings', 'Estimated Earnings', HOVER_TEXT.NONE, STEP_ICON.NUMBER ],
];

const StepsIcon = ({ stepClassName, ...props }) => {
    return (
        <div {...props} className={`steps-header-icon ${stepClassName}`}></div>
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

export const STEPS_HEADER_VERSIONS = { DEFAULT: 'DEFAULT', }

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
                        }, STEPS_CONFIG_DEFAULT)
                    }
                </Steps>
            </div>
        );
    }
}