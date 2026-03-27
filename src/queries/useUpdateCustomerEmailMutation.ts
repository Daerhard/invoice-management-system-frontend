import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCustomerEmail } from '../api/generated/customers';
import { PROFESSIONAL_CUSTOMERS_QUERY_KEY } from './useProfessionalCustomersQuery';

export function useUpdateCustomerEmailMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userName, email }: { userName: string; email: string }) =>
            updateCustomerEmail(userName, { email }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFESSIONAL_CUSTOMERS_QUERY_KEY });
        },
    });
}
