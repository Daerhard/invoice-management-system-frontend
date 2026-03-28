import { useMutation } from '@tanstack/react-query';
import { sendInvoiceEmail, testSendInvoiceEmail } from '../api/generated/invoice-email';
import { TestSendInvoiceEmailRequest } from '../api/generated/Schemas';

export function useSendInvoiceEmailMutation() {
    return useMutation({
        mutationFn: (orderId: number) => sendInvoiceEmail(orderId),
    });
}

export function useSendTestInvoiceEmailMutation() {
    return useMutation({
        mutationFn: (request: TestSendInvoiceEmailRequest) => testSendInvoiceEmail(request),
    });
}
