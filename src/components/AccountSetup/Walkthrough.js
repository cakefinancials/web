import React, { Component } from "react";
import { Button, Grid, Row, Col } from "react-bootstrap";
import * as R from "ramda";

import { userStateActions, updateUserState } from "../../libs/userState";

import Welcome from "./Welcome";
import PersonalDetails from "./PersonalDetails";
import StepsHeader, { STEPS_CONFIG_DEFAULT, STEPS_HEADER_VERSIONS } from "./StepsHeader";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

const WALKTHROUGH_ORDER = [
    WALKTHROUGH.WELCOME,
    WALKTHROUGH.PERSONAL_DETAILS,
    WALKTHROUGH.BROKERAGE_ACCESS,
    WALKTHROUGH.BANK_DETAILS,
    WALKTHROUGH.ESTIMATED_EARNINGS,
    WALKTHROUGH.LOAN_PAPERWORK,
    WALKTHROUGH.DONE
];

const getNextStep = (walkthroughStep) => {
    return R.pipe(
        R.findIndex(R.equals(walkthroughStep)),
        R.add(1),
        R.prop(R.__, WALKTHROUGH_ORDER)
    )(WALKTHROUGH_ORDER);
};

const getPreviousStep = (walkthroughStep) => {
    return R.pipe(
        R.findIndex(R.equals(walkthroughStep)),
        R.subtract(R.__, 1),
        R.prop(R.__, WALKTHROUGH_ORDER)
    )(WALKTHROUGH_ORDER);
};

const WALKTHROUGH_PAGE_TO_COMPONENT = {
    [WALKTHROUGH.WELCOME]: Welcome,
    [WALKTHROUGH.PERSONAL_DETAILS]: PersonalDetails,
    [WALKTHROUGH.BROKERAGE_ACCESS]: function Screen3(props) { return <h1>Screen 3 folksl!!!</h1>; },
    [WALKTHROUGH.BANK_DETAILS]: function Screen4(props) { return <h1>Screen 4 folksl!!!</h1>; },
    [WALKTHROUGH.ESTIMATED_EARNINGS]: function Screen5(props) { return <h1>Screen 5 folksl!!!</h1>; },
    [WALKTHROUGH.LOAN_PAPERWORK]: function Screen6(props) { return <h1>Screen 6 folksl!!!</h1>; },
};

export default class Walkthrough extends Component {
    renderCurrentStep(currentWalkthroughStep) {
        const navigateToNext = () => {
            userStateActions.setWalkthroughStep(getNextStep(currentWalkthroughStep));
            updateUserState();
        };

        const navigateToPrevious = () => {
            userStateActions.setWalkthroughStep(getPreviousStep(currentWalkthroughStep));
            updateUserState();
        };

        const ComponentForPage = WALKTHROUGH_PAGE_TO_COMPONENT[currentWalkthroughStep];

        return <ComponentForPage navigateToNext={navigateToNext} navigateToPrevious={navigateToPrevious} />;
    };

    renderStepsHeader(currentWalkthroughStep) {
        if (currentWalkthroughStep === WALKTHROUGH.WELCOME) {
            return null;
        }

        const walkthroughSteps = R.map(R.head, STEPS_CONFIG_DEFAULT);
        const currentStepIdx = R.indexOf(currentWalkthroughStep, walkthroughSteps);
        const filterIndexed = R.addIndex(R.filter);

        const completedSteps = filterIndexed((step, idx) => idx < currentStepIdx, walkthroughSteps);

        return (
            <Grid>
                <Row>
                    <Col xs={8} xsOffset={2}>
                        <StepsHeader
                            highlightedSteps={ [ currentWalkthroughStep ] }
                            completedSteps={ completedSteps }
                            stepsVersion={ STEPS_HEADER_VERSIONS.DEFAULT }
                        />
                    </Col>
                </Row>
            </Grid>
        );
    }

    renderMainContent() {
        const currentWalkthroughStep = userStateActions.getWalkthroughStep();

        return (
            <div>
                { this.renderStepsHeader(currentWalkthroughStep) }
                { this.renderCurrentStep(currentWalkthroughStep) }
            </div>
        );
    }

    render() {
        return (
            <div className="walkthrough">
                { this.renderMainContent() }
            </div>
        );
    }
}