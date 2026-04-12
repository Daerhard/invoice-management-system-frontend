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
            axios: './src/api/apiClient',
            operations: {
                getPDFInvoices: {
                    responseType: 'blob',
                },
                getPurchaseInvoiceItemPdf: {
                    responseType: 'blob',
                },
                getRefundPdf: {
                    responseType: 'blob',
                },
                getSupplyPdf: {
                    responseType: 'blob',
                }
            }
        }
    }
}
export {}
