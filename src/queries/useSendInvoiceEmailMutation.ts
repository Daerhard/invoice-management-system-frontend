import { useMutation } from '@tanstack/react-query';
import { sendInvoiceEmail, sendTestInvoiceEmail } from '../api/generated/orders';
import { TestEmailRequest } from '../api/generated/Schemas';

export function useSendInvoiceEmailMutation() {
    return useMutation({
        mutationFn: (orderId: number) => sendInvoiceEmail(orderId),
    });
}

export function useSendTestInvoiceEmailMutation() {
    return useMutation({
        mutationFn: (request: TestEmailRequest) => sendTestInvoiceEmail(request),
    });
}
