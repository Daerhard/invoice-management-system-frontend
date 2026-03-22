import { QueryFunction, useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useGenericRequest<T>(
    queryKey: string,
    queryFn: QueryFunction<T>,
    options?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) {
  const { data, ...rest } = useQuery<T>({
    queryKey: [queryKey],
    queryFn,
    ...options,
  });

  return {
    data,
    ...rest,
  };
}
