import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useQueryParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateWithParams = (
    params: URLSearchParams,
    mode: 'push' | 'replace' = 'push',
  ) => {
    const queryString = params.toString();
    const currentQueryString = searchParams.toString();

    // Avoid pushing the same URL repeatedly, which can cause request loops
    if (queryString === currentQueryString) {
      return;
    }

    const href = queryString ? `${pathname}?${queryString}` : pathname;
    if (mode === 'replace') {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const changeQuery = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    navigateWithParams(params);
  };

  const changeQueries = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const currentQueryString = searchParams.toString();
      if (queryString === currentQueryString) return;
      const href = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(href);
    },
    [router, pathname, searchParams],
  );

  const replaceQueries = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const currentQueryString = searchParams.toString();
      if (queryString === currentQueryString) return;
      const href = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(href);
    },
    [router, pathname, searchParams],
  );

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
    replaceQueries,
    removeQuery,
    setPage,
    page: Number(query.get('page') || '1'),
    search: query.get('search') || '',
    query
  };
};
