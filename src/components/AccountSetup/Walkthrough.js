import React, { Component, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import * as R from 'ramda';

import { userStateActions, updateUserState } from '../../libs/userState';

import PersonalDetails from './PersonalDetails';
import BrokerageAccess from './BrokerageAccess';
import BankDetails from './BankDetails';
import EstimatedEarnings from './EstimatedEarnings';
import StepsHeader, { STEPS_CONFIG_DEFAULT, STEPS_HEADER_VERSIONS } from './StepsHeader';

const {
  CONSTANTS: { WALKTHROUGH },
} = userStateActions;

const WALKTHROUGH_ORDER = [
  WALKTHROUGH.PERSONAL_DETAILS,
  WALKTHROUGH.BROKERAGE_ACCESS,
  WALKTHROUGH.BANK_DETAILS,
  WALKTHROUGH.ESTIMATED_EARNINGS,
  WALKTHROUGH.DONE,
];

const getNextStep = walkthroughStep => {
  return R.pipe(
    R.findIndex(R.equals(walkthroughStep)),
    R.add(1),
    R.prop(R.__, WALKTHROUGH_ORDER)
  )(WALKTHROUGH_ORDER);
};

const getPreviousStep = walkthroughStep => {
  return R.pipe(
    R.findIndex(R.equals(walkthroughStep)),
    R.subtract(R.__, 1),
    R.prop(R.__, WALKTHROUGH_ORDER)
  )(WALKTHROUGH_ORDER);
};

const WALKTHROUGH_PAGE_TO_COMPONENT = {
  [WALKTHROUGH.PERSONAL_DETAILS]: PersonalDetails,
  [WALKTHROUGH.BROKERAGE_ACCESS]: BrokerageAccess,
  [WALKTHROUGH.BANK_DETAILS]: BankDetails,
  [WALKTHROUGH.ESTIMATED_EARNINGS]: EstimatedEarnings,
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
  }

  renderStepsHeader(currentWalkthroughStep) {
    const walkthroughSteps = R.map(R.head, STEPS_CONFIG_DEFAULT);
    const currentStepIdx = R.indexOf(currentWalkthroughStep, walkthroughSteps);
    const filterIndexed = R.addIndex(R.filter);

    const completedSteps = filterIndexed((step, idx) => idx < currentStepIdx, walkthroughSteps);

    return (
      <Col xs={8} xsOffset={2}>
        <StepsHeader
          highlightedSteps={[currentWalkthroughStep]}
          completedSteps={completedSteps}
          stepsVersion={STEPS_HEADER_VERSIONS.DEFAULT}
        />
      </Col>
    );
  }

  renderMainContent() {
    const currentWalkthroughStep = userStateActions.getWalkthroughStep();

    return (
      <Fragment>
        <Row>{this.renderStepsHeader(currentWalkthroughStep)}</Row>
        <br />
        <br />
        <Row>{this.renderCurrentStep(currentWalkthroughStep)}</Row>
      </Fragment>
    );
  }

  render() {
    return <div className="walkthrough">{this.renderMainContent()}</div>;
  }
}
