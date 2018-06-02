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

    const createSetter = (pathInUserStateBag) => (valueToSet) => {
        const updatedLocalUserState = localUserState.setIn(
            pathInUserStateBag,
            valueToSet
        );
        userStateChangeHistory.push(updatedLocalUserState);
        localUserState = updatedLocalUserState;

        notify();
    };

    const createGetter = (pathInUserStateBag, notSetValue) => () => {
        const value = localUserState.getIn(pathInUserStateBag, notSetValue);
        if (Immutable.isImmutable(value)) {
            return value.toJS();
        } else {
            return value;
        }
    };

    return {
        CONSTANTS,
        setWalkthroughStep: createSetter(['walkthrough', 'step']),
        getWalkthroughStep: createGetter(['walkthrough', 'step'], CONSTANTS.WALKTHROUGH.PAGE1)
    };
})();
