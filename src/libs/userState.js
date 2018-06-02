import { API } from "aws-amplify";
import Immutable from "immutable";

let lastSyncedUserState;
let localUserState;
let syncErrors = [];
let syncing = false;

const userStateChangeHistory = [];

let notifyFunctions = [];
const notify = () => {
    notifyFunctions.forEach(fn => fn({
        lastSyncedUserState,
        localUserState,
        syncErrors,
        syncing,
    }));
};

export const subscribe = (notifyFunction) => {
    notifyFunctions.push(notifyFunction);
};

export const fetchUserState = async () => {
    const response = await API.get("cake", "/user/state");

    lastSyncedUserState = Immutable.fromJS(response);
    localUserState = lastSyncedUserState;

    notify();
};

export const updateUserState = async () => {
    try {
        syncing = true;
        notify();

        await API.post(
            "cake",
            "/user/state",
            {
                body: {
                    previousState: lastSyncedUserState.toJS(),
                    nextState: localUserState.toJS(),
                }
            }
        );

        lastSyncedUserState = localUserState;
    } catch (err) {
        syncErrors.push(err);
    }

    syncing = false;
    notify();
};

const setterWrapper = (setterFn) => (...setterArgs) => {
    const updatedLocalUserState = setterFn(...setterArgs);
    userStateChangeHistory.push(updatedLocalUserState);
    localUserState = updatedLocalUserState;

    notify();
};

export const userStateActions = (() => {
    const CONSTANTS = {
        WALKTHROUGH: {
            PAGE1: 'PAGE1',
            PAGE2: 'PAGE2',
            PAGE3: 'PAGE3',
            PAGE4: 'PAGE4',
            DONE: 'DONE'
        }
    };

    return {
        CONSTANTS,
        setWalkthroughStep: setterWrapper((walkthroughStep) => {
            return localUserState.setIn(
                ['walkthrough', 'step'],
                walkthroughStep
            );
        }),
        getWalkthroughStep: () => localUserState.getIn(['walkthrough', 'step'], CONSTANTS.WALKTHROUGH.PAGE1)
    };
})();
