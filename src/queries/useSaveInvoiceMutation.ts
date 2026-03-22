import { useMutation } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { createInvoice } from '../api/generated/orders';
import { cardmarketOrdersAtom } from '../store/Global';

export function useSaveInvoiceMutation() {
    const setCardmarketOrders = useSetAtom(cardmarketOrdersAtom);
    return useMutation({
        mutationFn: (orderId: number) => createInvoice(orderId),
        onSuccess: (response, orderId) => {
            const invoice = response.data;
            setCardmarketOrders((prev) =>
                prev.map((order) =>
                    order.order_id === orderId ? { ...order, invoice } : order
                )
            );
        },
    });
}
