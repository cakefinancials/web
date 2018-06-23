import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as R from "ramda";

import { userStateActions, updateUserState } from "../../libs/userState";

import Welcome from "./Welcome";
import PersonalDetails from "./PersonalDetails";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

const WALKTHROUGH_ORDER = [
    WALKTHROUGH.WELCOME,
    WALKTHROUGH.PERSONAL_DETAILS,
    WALKTHROUGH.BROKERAGE_ACCESS,
    WALKTHROUGH.BANK_DETAILS,
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

    renderMainContent() {
        const currentWalkthroughStep = userStateActions.getWalkthroughStep();

        return (
            <div>
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