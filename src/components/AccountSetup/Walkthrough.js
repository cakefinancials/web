import React, { Component } from "react";
import { Button } from "react-bootstrap";
import * as R from "ramda";

import { userStateActions, updateUserState } from "../../libs/userState";

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
        R.subtract(1),
        R.prop(R.__, WALKTHROUGH_ORDER)
    )(WALKTHROUGH_ORDER);
};

export default class Walkthrough extends Component {
    constructor(props) {
        super(props);
    }

    renderMainContent() {
        const currentWalkthroughStep = userStateActions.getWalkthroughStep();

        return (
            <div>
                Current walkthrough step: { currentWalkthroughStep }
                <Button
                    block
                    bsStyle="warning"
                    bsSize="large"
                    disabled={currentWalkthroughStep === WALKTHROUGH.PAGE1}
                    onClick={e => {
                        userStateActions.setWalkthroughStep(getPreviousStep(currentWalkthroughStep))
                        updateUserState();
                    }}
                >
                    Previous
                </Button>
                <Button
                    block
                    bsStyle="warning"
                    bsSize="large"
                    disabled={currentWalkthroughStep === WALKTHROUGH.PAGE4}
                    onClick={e => {
                        userStateActions.setWalkthroughStep(getNextStep(currentWalkthroughStep));
                        updateUserState();
                    }}
                >
                    Next
                </Button>
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