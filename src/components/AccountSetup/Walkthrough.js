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
        R.subtract(R.__, 1),
        R.prop(R.__, WALKTHROUGH_ORDER)
    )(WALKTHROUGH_ORDER);
};

export default class Walkthrough extends Component {
    renderCurrentStep(currentWalkthroughStep) {
        console.log(currentWalkthroughStep);
        return ({
            [WALKTHROUGH.PAGE1]: () => <span>PAGE 1!!!!</span>,
            [WALKTHROUGH.PAGE2]: () => <span>PAGE 2!!!!</span>,
            [WALKTHROUGH.PAGE3]: () => <span>PAGE 3!!!!</span>,
            [WALKTHROUGH.PAGE4]: () => {
                return (
                    <div>
                        PAGE 4!!!!
                        <Button
                            block
                            bsStyle="warning"
                            bsSize="large"
                            onClick={e => {
                                userStateActions.setWalkthroughStep(WALKTHROUGH.DONE)
                                updateUserState();
                            }}
                        >
                            FINISH HIM!!!
                        </Button>
                    </div>
                );
            }
        })[currentWalkthroughStep]();
    };

    renderMainContent() {
        const currentWalkthroughStep = userStateActions.getWalkthroughStep();

        return (
            <div>
                { this.renderCurrentStep(currentWalkthroughStep) }
                <Button
                    block
                    bsStyle="warning"
                    bsSize="large"
                    disabled={currentWalkthroughStep === R.head(WALKTHROUGH_ORDER)}
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
                    disabled={currentWalkthroughStep === R.head(R.slice(-2, -1, WALKTHROUGH_ORDER))}
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