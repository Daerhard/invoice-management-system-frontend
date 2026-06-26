import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importCSVPurchaseData } from '../api/generated/cardmarket-purchases';
import { ImportCSVPurchaseDataBody } from '../api/generated/Schemas';

export const PURCHASES_QUERY_KEY = ['cardmarketPurchases'] as const;

export function useImportPurchasesMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ImportCSVPurchaseDataBody) => importCSVPurchaseData(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PURCHASES_QUERY_KEY });
        },
    });
}
