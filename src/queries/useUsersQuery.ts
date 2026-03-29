import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '../api/generated/users';

export const USERS_QUERY_KEY = ['users'] as const;

export function useUsersQuery() {
    return useQuery({
        queryKey: USERS_QUERY_KEY,
        queryFn: () => getAllUsers(),
    });
}
