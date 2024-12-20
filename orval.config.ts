const path = require('path');

module.exports = {
    invoiceManagementSystem: {
        output: {
            mode: 'tags',
            target: 'src/api/generated/',
            schemas: 'src/api/generated/Schemas',
        },
        input: {
            target: './openapi/openapi.yml',
        },
        override: {
            axios: './src/axiosConfig',
        },
    },
};

