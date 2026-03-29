import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../api/generated/users';
import { User } from '../api/generated/Schemas';
import { USERS_QUERY_KEY } from './useUsersQuery';

export function useUpdateUserMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user }: { id: number; user: User }) => updateUser(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        },
    });
}
