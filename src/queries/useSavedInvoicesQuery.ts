import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../api/generated/invoices';

export const SAVED_INVOICES_QUERY_KEY = ['savedInvoices'] as const;

export function useSavedInvoicesQuery() {
    return useQuery({
        queryKey: SAVED_INVOICES_QUERY_KEY,
        queryFn: () => getInvoices(),
    });
}
