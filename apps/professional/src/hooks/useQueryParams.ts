import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    const currentQueryString = searchParams.toString();

    // Avoid pushing the same URL repeatedly, which can cause request loops
    if (queryString === currentQueryString) {
      return;
    }

    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const changeQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    navigateWithParams(params);
  };

  const changeQueries = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    navigateWithParams(params);
  };

  const removeQuery = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    navigateWithParams(params);
  };

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    navigateWithParams(params);
  };

  const query = new URLSearchParams(searchParams.toString());

  return {
    changeQuery,
    changeQueries,
    removeQuery,
    setPage,
    page: Number(query.get('page') || '1'),
    search: query.get('search') || '',
    query
  };
};
