"use client";

import { Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useAccessNewDraft } from "../../context/AccessNewDraftContext";
import { ACCESS_OBJECT_OPTIONS } from "../../data/accessNewOptions.mock";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessSelectField } from "./AccessFormField";

const OBJECT_OPTIONS = ACCESS_OBJECT_OPTIONS.map((value) => ({ value, label: value }));

/**
 * "Object Link" card: the project or order the access belongs to. The select sets it
 * (it is optional); what the Link button adds is not designed, so it shows the coming-soon toast.
 */
export function AccessNewObjectCard() {
	const { info, setInfoField } = useAccessNewDraft();
	const showComingSoon = useComingSoonToast();

	return (
		<AccessSectionCard icon={<Contact className="h-5 w-5" aria-hidden />} title={localizationConstants.accessNewSectionObject}>
			<div className="flex flex-col gap-4 p-4">
				<AccessSelectField
					id="access-new-object"
					label={localizationConstants.accessNewFieldObject}
					placeholder={localizationConstants.accessNewObjectPlaceholder}
					value={info.objectRef}
					onChange={(value) => setInfoField("objectRef", value)}
					options={OBJECT_OPTIONS}
					allowEmpty
				/>
				<Button type="button" className="h-9 cursor-pointer self-end bg-zinc-900 px-5 text-white hover:bg-zinc-800" onClick={showComingSoon}>
					<Translate text={localizationConstants.accessNewLinkButton} />
				</Button>
			</div>
		</AccessSectionCard>
	);
}
