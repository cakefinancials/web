import { API, Auth } from 'aws-amplify';
import Immutable from 'immutable';

const getSimpleEventListener = () => {
    const notifyFns = [];
    let notifiedCalledAtLeastOnce = false;
    let lastNotification = null;

    const subscribe = (notifyFn) => {
        notifyFns.push(notifyFn);

        if (notifiedCalledAtLeastOnce) {
            notifyFn(lastNotification);
        }

        const unsubscribe = () => {
            const indexOfNotifyFn = notifyFns.indexOf(notifyFn);

            if (~indexOfNotifyFn) {
                notifyFns.splice(indexOfNotifyFn, 1);
            }
        };

        return unsubscribe;
    };

    return {
        subscribe,
        subscribeWithInitialization: (initFn) => {
            let initialized = false;

            return (fn) => {
                if (!initialized) {
                    initFn();
                    initialized = true;
                }

                return subscribe(fn);
            };
        },
        notify: (notification) => {
            lastNotification = notification;
            notifiedCalledAtLeastOnce = true;
            notifyFns.forEach(notifyFn => notifyFn(notification));
        }
    };
};

const userStateNotificationBlob = {
    lastSyncedUserState: null,
    localUserState: null,
    syncErrors: [],
    syncingUserState: false,
    loadingUserState: false,
};

const userStateChangeHistory = [];

const userStateNotifier = getSimpleEventListener();

const notifyUserStateChange = () => userStateNotifier.notify(userStateNotificationBlob);

const fetchUserState = async () => {
    userStateNotificationBlob.loadingUserState = true;
    notifyUserStateChange();

    const response = await API.get('cake', '/user/state');

    userStateNotificationBlob.lastSyncedUserState = Immutable.fromJS(response);
    userStateNotificationBlob.localUserState = userStateNotificationBlob.lastSyncedUserState;
    userStateNotificationBlob.loadingUserState = false;

    notifyUserStateChange();
};

export const subscribeUserStateChange = userStateNotifier.subscribeWithInitialization(fetchUserState);

export const updateUserState = async () => {
    try {
        userStateNotificationBlob.syncingUserState = true;
        notifyUserStateChange();

        await API.post(
            'cake',
            '/user/state',
            {
                body: {
                    previousState: userStateNotificationBlob.lastSyncedUserState.toJS(),
                    nextState: userStateNotificationBlob.localUserState.toJS(),
                }
            }
        );

        userStateNotificationBlob.lastSyncedUserState = userStateNotificationBlob.localUserState;
    } catch (err) {
        userStateNotificationBlob.syncErrors.push(err);
    }

    userStateNotificationBlob.syncingUserState = false;
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
        const updatedLocalUserState = userStateNotificationBlob.localUserState.setIn(
            pathInUserStateBag,
            valueToSet
        );
        userStateChangeHistory.push(updatedLocalUserState);
        userStateNotificationBlob.localUserState = updatedLocalUserState;

        notifyUserStateChange();
    };

    const createGetter = (pathInUserStateBag, notSetValue) => () => {
        const value = userStateNotificationBlob.localUserState.getIn(pathInUserStateBag, notSetValue);
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

/**
 * USER SESSION
 */

const userSessionNotifier = getSimpleEventListener();

export const clearCurrentUserSession = () => {
    userSessionNotifier.notify(null);
};

export const fetchCurrentUserSession = async () => {
    const currentSession = await Auth.currentSession();
    userSessionNotifier.notify(currentSession);
};

export const subscribeSessionChange = userSessionNotifier.subscribe;

/**
 * DASHBOARD DATA
 */

const userDashboardDataNotifier = getSimpleEventListener();

export const fetchUserDashboardData = async () => {
    userDashboardDataNotifier.notify({ userDashboardData: null, loading: true, error: false });
    try {
        const userDashboardData = (await API.get('cake', '/user/dashboard_data')).dashboardData;
        userDashboardDataNotifier.notify({ userDashboardData, loading: false, error: false });
    } catch (e) {
        userDashboardDataNotifier.notify({ userDashboardData: null, loading: false, error: true });
    }
};

export const subscribeUserDashboardDataChange = userDashboardDataNotifier.subscribeWithInitialization(fetchUserDashboardData);

/**
 * Brokerage Data
 */

const obfuscatedBrokerageDataNotifier = getSimpleEventListener();

export const fetchBrokerageData = async () => {
    obfuscatedBrokerageDataNotifier.notify({ obfuscatedBrokerageData: null, loading: true, error: false });
    try {
        const obfuscatedBrokerageData = (await API.get('cake', '/brokerage/credentials/obfuscated'));
        obfuscatedBrokerageDataNotifier.notify({ obfuscatedBrokerageData, loading: false, error: false });
    } catch (e) {
        obfuscatedBrokerageDataNotifier.notify({ obfuscatedBrokerageData: null, loading: false, error: true });
    }
};

export const saveBrokerageCredentials = async (brokerageCredentials) => {
    const result = await API.post('cake', '/brokerage/credentials', { body: brokerageCredentials });
    fetchBrokerageData();

    return result;
};

export const subscribeObfuscatedBrokerageData = obfuscatedBrokerageDataNotifier.subscribeWithInitialization(fetchBrokerageData);
