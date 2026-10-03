import localizationConstants from "@/utils/translation/constants";
import type { AccessNewContact, AccessNewKey } from "../../types/accessNew.types";
import type { AccessConfirmText } from "../AccessConfirmDialog";

/** What the wizard asks to confirm: leaving with everything typed, or removing one added row. */
export type AccessNewConfirmTarget =
	| { kind: "discard" }
	| { kind: "contact"; contact: AccessNewContact }
	| { kind: "key"; key: AccessNewKey };

export function describeNewConfirm(target: AccessNewConfirmTarget): AccessConfirmText {
	switch (target.kind) {
		case "discard":
			return {
				title: localizationConstants.accessNewDiscardTitle,
				description: localizationConstants.accessNewDiscardDescription,
				values: {},
				confirmLabel: localizationConstants.accessNewDiscardConfirm,
			};
		case "contact":
			return {
				title: localizationConstants.accessNewRemoveContactTitle,
				description: localizationConstants.accessNewRemoveContactDescription,
				values: { name: target.contact.name },
			};
		case "key":
			return {
				title: localizationConstants.accessNewRemoveKeyTitle,
				description: localizationConstants.accessNewRemoveKeyDescription,
				values: { id: target.key.keyId },
			};
	}
}
