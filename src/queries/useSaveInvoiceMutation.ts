import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInvoice } from '../api/generated/orders';
import { ORDERS_QUERY_KEY } from './useOrdersQuery';

export function useSaveInvoiceMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: number) => createInvoice(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
    });
}
