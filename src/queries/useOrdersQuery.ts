import { useQuery } from '@tanstack/react-query';
import { getOrders } from '../api/ordersApi';

export const ORDERS_QUERY_KEY = ['orders'] as const;

export function useOrdersQuery() {
    return useQuery({
        queryKey: ORDERS_QUERY_KEY,
        queryFn: () => getOrders(),
    });
}
