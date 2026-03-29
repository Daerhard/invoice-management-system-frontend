import { useMutation } from '@tanstack/react-query';
import { sendInvoiceEmail } from '../api/generated/email';
import { InvoiceEmailRequest } from '../api/generated/Schemas';

export function useSendInvoiceEmailMutation() {
    return useMutation({
        mutationFn: ({ orderId, request }: { orderId: number; request?: InvoiceEmailRequest }) =>
            sendInvoiceEmail(orderId, request),
    });
}
