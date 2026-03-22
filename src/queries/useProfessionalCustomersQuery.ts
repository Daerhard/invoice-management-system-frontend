import { useQuery } from '@tanstack/react-query';
import { getProfessionalCustomers } from '../api/generated/customers';

export const PROFESSIONAL_CUSTOMERS_QUERY_KEY = ['customers', 'professional'] as const;

export function useProfessionalCustomersQuery() {
    return useQuery({
        queryKey: PROFESSIONAL_CUSTOMERS_QUERY_KEY,
        queryFn: () => getProfessionalCustomers(),
    });
}
