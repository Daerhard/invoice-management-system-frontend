import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../api/generated/users';
import { User } from '../api/generated/Schemas';
import { USERS_QUERY_KEY } from './useUsersQuery';

export function useCreateUserMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: User) => createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
}
