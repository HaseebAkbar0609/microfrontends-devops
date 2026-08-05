"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: T[]) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
	const paged = useMemo(
		() => items.slice((page - 1) * pageSize, page * pageSize),
		[items, page, pageSize],
	);

	const setPageSize = (size: number) => {
		setPageSizeState(size);
		setPage(1);
	};

	return { page, setPage, pageSize, setPageSize, paged, totalPages };
}
