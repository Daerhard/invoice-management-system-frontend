import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { sendInvoiceEmail } from '../api/generated/email';
import { InvoiceEmailRequest } from '../api/generated/Schemas';
import { cardmarketOrdersAtom } from '../store/Global';
import { ORDERS_QUERY_KEY } from './useOrdersQuery';

export function useSendInvoiceEmailMutation() {
    const queryClient = useQueryClient();
    const setCardmarketOrders = useSetAtom(cardmarketOrdersAtom);

    return useMutation({
        mutationFn: ({ orderId, request }: { orderId: number; request?: InvoiceEmailRequest }) =>
            sendInvoiceEmail(orderId, request),
        onSuccess: (_, { orderId }) => {
            setCardmarketOrders((prev) =>
                prev.map((order) => {
                    if (order.order_id !== orderId || !order.invoice) {
                        return order;
                    }

                    return {
                        ...order,
                        invoice: {
                            ...order.invoice,
                            sent: true,
                        },
                    };
                })
            );

            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
    });
}
