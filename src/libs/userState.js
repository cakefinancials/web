import { API } from 'aws-amplify';
import Immutable from 'immutable';

let lastSyncedUserState;
let localUserState;
let syncErrors = [];
let syncingUserState = false;

const userStateChangeHistory = [];

let userStateNotifyFunctions = [];
const notifyUserStateChange = () => {
    userStateNotifyFunctions.forEach(fn => fn({
        lastSyncedUserState,
        localUserState,
        syncErrors,
        syncingUserState,
    }));
};

export const subscribeUserStateChange = (notifyFunction) => {
    userStateNotifyFunctions.push(notifyFunction);
};

export const fetchUserState = async () => {
    const response = await API.get('cake', '/user/state');

    lastSyncedUserState = Immutable.fromJS(response);
    localUserState = lastSyncedUserState;

    notifyUserStateChange();
};

export const updateUserState = async () => {
    try {
        syncingUserState = true;
        notifyUserStateChange();

        await API.post(
            'cake',
            '/user/state',
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

    syncingUserState = false;
    notifyUserStateChange();
};

export const userStateActions = (() => {
    const CONSTANTS = {
        WALKTHROUGH: {
            PERSONAL_DETAILS: 'PERSONAL_DETAILS',
            BROKERAGE_ACCESS: 'BROKERAGE_ACCESS',
            BANK_DETAILS: 'BANK_DETAILS',
            ESTIMATED_EARNINGS: 'ESTIMATED_EARNINGS',
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

        notifyUserStateChange();
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
        setWalkthroughStep: createSetter([ 'walkthrough', 'step' ]),
        getWalkthroughStep: createGetter([ 'walkthrough', 'step' ], CONSTANTS.WALKTHROUGH.PERSONAL_DETAILS)
    };
})();

let currentUserSession = null;

export const setCurrentUserSession = (session) => {
    currentUserSession = session;
    notifySessionChange();
};

export const getCurrentUserSession = () => currentUserSession;

let sessionNotifyFunctions = [];
const notifySessionChange = () => {
    sessionNotifyFunctions.forEach(fn => fn(currentUserSession));
};

export const subscribeSessionChange = (notifyFunction) => {
    sessionNotifyFunctions.push(notifyFunction);
};

let userDashboardData = null;
export const fetchUserDashboardData = async ({ force = false }) => {
    if (force || userDashboardData === null) {
        userDashboardData = (await API.get('cake', '/user/dashboard_data')).dashboardData;
    }

    return userDashboardData;
};