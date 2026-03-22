import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveInvoice } from '../api/generated/invoices';
import { SAVED_INVOICES_QUERY_KEY } from './useSavedInvoicesQuery';

export function useSaveInvoiceMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderId: number) => saveInvoice(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SAVED_INVOICES_QUERY_KEY });
        },
    });
}
