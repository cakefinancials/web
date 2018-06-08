import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as R from "ramda";

import { userStateActions, updateUserState } from "../../libs/userState";

import Welcome from "./Welcome";

const { CONSTANTS: { WALKTHROUGH } } = userStateActions;

const WALKTHROUGH_ORDER = [
    WALKTHROUGH.PAGE1,
    WALKTHROUGH.PAGE2,
    WALKTHROUGH.PAGE3,
    WALKTHROUGH.PAGE4,
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
    [WALKTHROUGH.PAGE1]: Welcome,
    [WALKTHROUGH.PAGE2]: function Screen2(props) { return <h1>Screen 2 folksl!!!</h1>; },
    [WALKTHROUGH.PAGE3]: function Screen3(props) { return <h1>Screen 3 folksl!!!</h1>; },
    [WALKTHROUGH.PAGE4]: function Screen4(props) { return <h1>Screen 4 folksl!!!</h1>; },
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