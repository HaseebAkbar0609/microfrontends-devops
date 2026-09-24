"use client";

import { useCallback, useMemo, useState } from "react";

import { sortPoints } from "../meetingPoints";
import { PROTOCOL_POINTS_PAGE_SIZE } from "../projectProtocol.config";
import type { MeetingPoint } from "../types";

/**
 * The points table's paging. Rows are in agenda order; the page is clamped, so
 * deleting the last point on the last page lands on the page before rather
 * than an empty one.
 */
export function usePointsPage(points: MeetingPoint[]) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeValue] = useState(PROTOCOL_POINTS_PAGE_SIZE);

	const sorted = useMemo(() => sortPoints(points), [points]);
	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const currentPage = Math.min(page, totalPages);

	const setPageSize = useCallback((size: number) => {
		setPageSizeValue(size);
		setPage(1);
	}, []);

	/** Turns to the page a new or edited point sorts onto. Reads the list it was just saved into. */
	const reveal = useCallback(
		(id: string, next: MeetingPoint[]) => {
			const index = sortPoints(next).findIndex((point) => point.id === id);
			setPage(index < 0 ? 1 : Math.floor(index / pageSize) + 1);
		},
		[pageSize],
	);

	return {
		rows: sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
		currentPage,
		totalPages,
		pageSize,
		setPage,
		setPageSize,
		reveal,
	};
}

export type PointsPage = ReturnType<typeof usePointsPage>;
