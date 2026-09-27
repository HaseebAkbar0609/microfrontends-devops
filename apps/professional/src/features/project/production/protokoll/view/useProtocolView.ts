"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { generateTempId } from "@/lib/tempId";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { todayIso } from "../../../shared/todayIso";
import { useBeforeUnloadWarning } from "../../hooks/useBeforeUnloadWarning";
import { storedNamesOf } from "../form/meetingValues";
import { useMeetingPeople } from "../hooks/useMeetingPeople";
import { nextPointNr, upsertPoint } from "../meetingPoints";
import { nextPointStatus } from "../pointStatus";
import { protocolUrls } from "../protocolNav";
import * as store from "../services/projectProtocolService";
import type { MeetingKind, MeetingPoint, PointStatus, ProjectProtocol } from "../types";
import type { PointValues } from "./meetingPointSchema";
import type { ProtocolLeaveTarget } from "./useProtocolViewDialogs";

const NO_POINTS: MeetingPoint[] = [];
const NO_NAMES: string[] = [];

/**
 * A protocol's page: the stored protocol, and its points as edited here.
 *
 * Points change on the page and are stored by Spara or Skicka, as
 * Betalningsplan's rows are. "Unsaved" is a reference check — `points !==` the
 * stored list — sound because the list is only ever replaced, never mutated.
 * The protocol is resolved on the client: one created in this browser exists
 * only in this browser's store.
 */
export function useProtocolView(projectId: string, protocolId: string) {
	const t = useTranslate();
	const router = useRouter();

	const [saved, setSaved] = useState(() => store.getProtocol(projectId, protocolId));
	const meeting = saved?.meeting;
	/** Standard or Action — only a meeting has a page here, so an upload never reaches it. */
	const kind: MeetingKind | undefined = saved && saved.kind !== "upload" ? saved.kind : undefined;
	const savedPoints = meeting?.points ?? NO_POINTS;
	const [points, setPoints] = useState(savedPoints);

	const dirty = points !== savedPoints;
	useBeforeUnloadWarning(dirty);

	const storedNames = useMemo(() => (meeting ? storedNamesOf(meeting, points) : NO_NAMES), [meeting, points]);
	const people = useMeetingPeople(projectId, storedNames);

	/**
	 * Adds or replaces a point; returns its id and the new list, so the table can
	 * turn to it. The dialog has no status field, so an edited point keeps its
	 * own and a new one starts with none.
	 */
	const savePoint = useCallback(
		(values: PointValues, id?: string) => {
			/* The id is made here, in the handler — never inside a state updater,
			   which Strict Mode runs twice. */
			const point: MeetingPoint = {
				id: id ?? generateTempId(),
				nr: values.nr.trim(),
				responsible: values.responsible,
				title: values.title.trim(),
				description: values.description.trim(),
				decision: values.decision.trim(),
				status: id ? (points.find((item) => item.id === id)?.status ?? null) : null,
			};
			const next = upsertPoint(points, point);
			setPoints(next);
			return { id: point.id, points: next };
		},
		[points],
	);

	const removePoint = useCallback((id: string) => {
		setPoints((current) => current.filter((point) => point.id !== id));
	}, []);

	/** An Action point's toggle: sets the status, or clears it when it is already the one set. Unsaved until Spara. */
	const setPointStatus = useCallback((id: string, status: PointStatus) => {
		setPoints((current) =>
			current.map((point) => (point.id === id ? { ...point, status: point.status === status ? null : status } : point)),
		);
	}, []);

	/** ⋮ Ändra status: the next status in the toggles' order. Unsaved until Spara. */
	const cyclePointStatus = useCallback((id: string) => {
		setPoints((current) => current.map((point) => (point.id === id ? { ...point, status: nextPointStatus(point.status) } : point)));
	}, []);

	/** Stores the points when they changed; the stored protocol, or `undefined` when the store refused. */
	const persist = useCallback((): ProjectProtocol | undefined => {
		if (!saved) return undefined;
		if (!dirty) return saved;
		const updated = store.savePoints(projectId, saved.id, points);
		if (!updated?.meeting) {
			showToast("error", t(localizationConstants.projectProtocolSaveFailed));
			return undefined;
		}
		setSaved(updated);
		setPoints(updated.meeting.points);
		return updated;
	}, [dirty, points, projectId, saved, t]);

	const save = useCallback(() => {
		if (persist()) showToast("success", t(localizationConstants.projectProtocolSavedToast));
	}, [persist, t]);

	/** Skicka: stores the points, records the day it went out, and returns to the list. */
	const send = useCallback(() => {
		const protocol = persist();
		if (!protocol || !store.markProtocolSent(projectId, protocol.id, todayIso())) return;
		showToast("success", t(localizationConstants.projectProtocolSentToast));
		router.push(protocolUrls.list(projectId));
	}, [persist, projectId, router, t]);

	/** Leaves without storing — the page asks first when points are unsaved. */
	const leave = useCallback(
		(target: ProtocolLeaveTarget) =>
			router.push(target === "edit" ? protocolUrls.edit(projectId, protocolId) : protocolUrls.list(projectId)),
		[projectId, protocolId, router],
	);

	return {
		kind,
		meeting,
		points,
		dirty,
		people,
		nextPointNr: nextPointNr(points),
		savePoint,
		removePoint,
		setPointStatus,
		cyclePointStatus,
		save,
		send,
		leave,
	};
}

export type ProtocolViewState = ReturnType<typeof useProtocolView>;
