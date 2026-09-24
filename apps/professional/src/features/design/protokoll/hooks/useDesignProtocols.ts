"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_TYPE_LABELS } from "../../../project/production/protokoll/projectProtocol.config";
import { type ProtocolTypeLabel } from "../../../project/production/protokoll/protocolView";
import type {
	MeetingKind,
	NewMeetingInput,
	ProjectProtocol,
	UploadDetails,
} from "../../../project/production/protokoll/types";
import { getDesignProjektRecord } from "../../projektinformation/data/designProjektInfo.mock";
import { designProtocolUrls } from "../designProtocolNav";
import * as store from "../services/designProtocolService";

export interface DesignProtocolCreated {
	row: ProjectProtocol;
	protocols: ProjectProtocol[];
}

export function useDesignProtocols(projektId: string) {
	const { t } = useTranslation();
	const router = useRouter();
	const projekt = getDesignProjektRecord(projektId);

	const facts = projekt
		? {
				projectNo: projekt.projektNr,
				projectName: projekt.projektering.projekteringNamn,
			}
		: null;

	const [protocols, setProtocols] = useState(() =>
		store.listProtocols(projektId),
	);

	const typeLabel: ProtocolTypeLabel = useCallback(
		(type) => t(PROTOCOL_TYPE_LABELS[type]),
		[t],
	);

	const refresh = useCallback(
		() => setProtocols(store.listProtocols(projektId)),
		[projektId],
	);

	const afterCreate = useCallback(
		(created: ProjectProtocol | undefined): DesignProtocolCreated | undefined => {
			if (!created) {
				showToast("error", t(localizationConstants.projectProtocolSaveFailed));
				return undefined;
			}
			const next = store.listProtocols(projektId);
			setProtocols(next);
			showToast("success", t(localizationConstants.projectProtocolCreatedToast));
			return { row: created, protocols: next };
		},
		[projektId, t],
	);

	const createUpload = useCallback(
		(details: UploadDetails, file: File) =>
			afterCreate(store.createUpload(projektId, details, file)),
		[afterCreate, projektId],
	);

	const createMeeting = useCallback(
		(kind: MeetingKind, input: NewMeetingInput): boolean => {
			const created = facts
				? store.createMeeting(projektId, facts.projectNo, kind, input)
				: undefined;
			if (!created) {
				showToast("error", t(localizationConstants.projectProtocolSaveFailed));
				return false;
			}
			refresh();
			showToast("success", t(localizationConstants.projectProtocolCreatedToast));
			router.push(designProtocolUrls.view(projektId, created.id));
			return true;
		},
		[facts, projektId, refresh, router, t],
	);

	const toggleArchive = useCallback(
		(row: ProjectProtocol) => {
			store.setProtocolArchived(projektId, row.id, !row.archived);
			refresh();
			showToast(
				"success",
				t(
					row.archived
						? localizationConstants.projectProtocolRestoredToast
						: localizationConstants.projectProtocolArchivedToast,
				),
			);
		},
		[projektId, refresh, t],
	);

	const remove = useCallback(
		(row: ProjectProtocol) => {
			store.removeProtocol(projektId, row.id);
			refresh();
			showToast("success", t(localizationConstants.projectProtocolDeletedToast));
		},
		[projektId, refresh, t],
	);

	const open = useCallback(
		(row: ProjectProtocol) => {
			if (row.url) {
				window.open(row.url, "_blank", "noopener");
				return;
			}
			router.push(designProtocolUrls.view(projektId, row.id));
		},
		[projektId, router],
	);

	const print = useCallback((row: ProjectProtocol) => {
		if (row.url) {
			const win = window.open(row.url, "_blank", "noopener");
			win?.print();
		}
	}, []);

	return {
		projekt,
		facts,
		protocols,
		typeLabel,
		createUpload,
		createMeeting,
		toggleArchive,
		remove,
		open,
		print,
	};
}

export type DesignProtocolsState = ReturnType<typeof useDesignProtocols>;
