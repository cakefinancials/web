const URL_STAGES = {
    production: 'https://g2cx8m6l2b.execute-api.us-east-2.amazonaws.com/prod',
    development: 'https://nx253m7fba.execute-api.us-east-2.amazonaws.com/dev',
};

const PLAID_ENVIRONMENT = {
    production: 'sandbox',
    development: 'sandbox',
};

export default {
    plaid: {
        ENVIRONMENT: PLAID_ENVIRONMENT[process.env.NODE_ENV],
        PUBLIC_KEY: '80a51875e6f2dd59ebd12543360485',
        DISPLAY: process.env.NODE_ENV === 'development'
    },
    s3: {
        REGION: 'us-east-2',
        BUCKET: 'cake-financials-user-data'
    },
    apiGateway: {
        REGION: 'us-east-2',
        URL: URL_STAGES[process.env.NODE_ENV]
    },
    cognito: {
        REGION: 'us-east-2',
        USER_POOL_ID: 'us-east-2_9v5RltuvI',
        APP_CLIENT_ID: 'ouhluqj261q6ncmcrj39hkmqu',
        IDENTITY_POOL_ID: 'us-east-2:8fa49a70-2137-4d3f-9217-680e560c1cb4',
    }
};
