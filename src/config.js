const URL_STAGES = {
    production: 'https://g2cx8m6l2b.execute-api.us-east-2.amazonaws.com/prod',
    development: 'https://nx253m7fba.execute-api.us-east-2.amazonaws.com/dev',
};

export default {
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
