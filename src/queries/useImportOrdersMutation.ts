import { useMutation, useQueryClient } from '@tanstack/react-query';
import { importCSVData } from '../api/generated/csvimport';
import { ImportCSVDataBody } from '../api/generated/Schemas';
import { ORDERS_QUERY_KEY } from './useOrdersQuery';

export function useImportOrdersMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (body: ImportCSVDataBody) => importCSVData(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        },
    });
}
