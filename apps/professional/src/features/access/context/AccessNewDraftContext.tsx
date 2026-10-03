"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type {
	AccessNewContact,
	AccessNewContactDraft,
	AccessNewInfo,
	AccessNewKey,
	AccessNewKeyForm,
} from "../types/accessNew.types";
import { nextKeyId } from "../utils/accessNew";

const EMPTY_INFO: AccessNewInfo = { objectRef: "", name: "", address: "", postalCode: "", city: "" };

interface AccessNewDraftValue {
	info: AccessNewInfo;
	setInfoField: (field: keyof AccessNewInfo, value: string) => void;
	/** True once the user tried to go on, so the errors of step 1 are shown. */
	showInfoErrors: boolean;
	setShowInfoErrors: (show: boolean) => void;
	contacts: AccessNewContact[];
	addContact: (draft: AccessNewContactDraft) => AccessNewContact;
	removeContact: (id: string) => void;
	keys: AccessNewKey[];
	addKey: (form: AccessNewKeyForm, accessTo: string[]) => AccessNewKey | null;
	removeKey: (id: string) => void;
	reset: () => void;
}

const AccessNewDraftContext = createContext<AccessNewDraftValue | null>(null);

/**
 * The half-filled new access, shared by the two steps so going back and forth keeps
 * what was typed. It lives only while the wizard is open (the provider sits on the
 * wizard's layout), so leaving it starts the next one empty.
 */
export function AccessNewDraftProvider({ children }: { children: ReactNode }) {
	const [info, setInfo] = useState<AccessNewInfo>(EMPTY_INFO);
	const [showInfoErrors, setShowInfoErrors] = useState(false);
	const [contacts, setContacts] = useState<AccessNewContact[]>([]);
	const [keys, setKeys] = useState<AccessNewKey[]>([]);
	// Ids must stay unique even for two rows added in the same moment, so a counter goes with the time.
	const counter = useRef(0);
	const newId = useCallback((prefix: string) => `${prefix}_${Date.now()}_${counter.current++}`, []);

	const setInfoField = useCallback((field: keyof AccessNewInfo, value: string) => setInfo((current) => ({ ...current, [field]: value })), []);
	const addContact = useCallback(
		(draft: AccessNewContactDraft) => {
			const contact: AccessNewContact = {
				id: newId("contact"),
				name: draft.person,
				email: draft.email.trim(),
				mobile: draft.mobile.trim(),
			};
			setContacts((current) => [...current, contact]);
			return contact;
		},
		[newId],
	);
	const removeContact = useCallback((id: string) => setContacts((current) => current.filter((contact) => contact.id !== id)), []);
	const addKey = useCallback(
		(form: AccessNewKeyForm, accessTo: string[]) => {
			if (form.type === "") return null;
			const key: AccessNewKey = {
				id: newId("key"),
				keyId: nextKeyId(keys),
				type: form.type,
				regNo: form.regNo.trim(),
				startDate: form.startDate,
				returnDate: form.returnDate,
				accessTo,
				company: form.company,
				person: form.person,
			};
			setKeys((current) => [...current, key]);
			return key;
		},
		[keys, newId],
	);
	const removeKey = useCallback((id: string) => setKeys((current) => current.filter((key) => key.id !== id)), []);
	const reset = useCallback(() => {
		setInfo(EMPTY_INFO);
		setShowInfoErrors(false);
		setContacts([]);
		setKeys([]);
	}, []);

	const value = useMemo(
		() => ({ info, setInfoField, showInfoErrors, setShowInfoErrors, contacts, addContact, removeContact, keys, addKey, removeKey, reset }),
		[info, setInfoField, showInfoErrors, contacts, addContact, removeContact, keys, addKey, removeKey, reset],
	);

	return <AccessNewDraftContext.Provider value={value}>{children}</AccessNewDraftContext.Provider>;
}

export function useAccessNewDraft(): AccessNewDraftValue {
	const value = useContext(AccessNewDraftContext);
	if (!value) throw new Error("useAccessNewDraft must be used inside AccessNewDraftProvider");
	return value;
}
