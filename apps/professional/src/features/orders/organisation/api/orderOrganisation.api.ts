import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { getOrderInformation } from "@/features/orders/opened/api/orderInformation.api";

export interface MemberItem {
	id: string;
	foretag: string;
	roll: string;
	kategori: string;
	address: string;
	postNr: string;
	ort: string;
	kontakt: string;
	mail: string;
}

export interface GroupSection {
	id: string;
	titleKey: TranslationKeys;
	items: MemberItem[];
}

/**
 * Normalizes an API record to the MemberItem domain model
 */
export function mapMemberFromApi(raw: Record<string, unknown>): MemberItem {
	return {
		id: String(raw.id || `member-${Date.now()}`),
		foretag: String(raw.company_name || raw.foretag || raw.companyName || raw.name || ""),
		roll: String(raw.role || raw.roll || ""),
		kategori: String(raw.category || raw.kategori || ""),
		address: String(raw.address || raw.visiting_address || raw.visitingAddress || ""),
		postNr: String(raw.postal_code || raw.postNr || raw.post_nr || raw.postalCode || ""),
		ort: String(raw.city || raw.ort || raw.visiting_city || raw.visitingCity || ""),
		kontakt: String(raw.contact_person || raw.kontakt || raw.contact || raw.contactPerson || ""),
		mail: String(raw.email || raw.mail || ""),
	};
}

/**
 * Builds default organisation sections dynamically matched to the specific order's company and customer details
 */
export function buildOrganisationGroupsForOrder(
	companyName = "Fastighetsbolaget",
	companyEmail = "kalle@gmail.com",
	companyAddress = "Storgatan 10",
	postalCode = "11752",
	city = "Stockholm",
	contactPerson = "Sture Blomgren",
	contactRole = "Bestallare"
): GroupSection[] {
	return [
		{
			id: "bestallare",
			titleKey: localizationConstants.orgGroupBestallare,
			items: [
				{
					id: "1",
					foretag: companyName,
					roll: contactRole,
					kategori: "Bestallare",
					address: companyAddress,
					postNr: postalCode,
					ort: city,
					kontakt: contactPerson,
					mail: companyEmail,
				},
			],
		},
		{
			id: "arkitet",
			titleKey: localizationConstants.orgGroupArkitekt,
			items: [
				{
					id: "2",
					foretag: "Ritbolaget AB",
					roll: "Arkitekt",
					kategori: "Bestallare",
					address: "Storgatan 10",
					postNr: "11752",
					ort: "Solna",
					kontakt: "Sara Nilsson",
					mail: "sara@ritbolaget.se",
				},
			],
		},
		{
			id: "byggentreprenor",
			titleKey: localizationConstants.orgGroupByggentreprenor,
			items: [
				{
					id: "3",
					foretag: "Bygg & Entreprenad Syd AB",
					roll: "Byggentreprenör",
					kategori: "Entreprenör",
					address: "Industrivägen 4",
					postNr: "11752",
					ort: "Stockholm",
					kontakt: "Johan Berg",
					mail: "johan@byggsyd.se",
				},
			],
		},
		{
			id: "elektriker",
			titleKey: localizationConstants.orgGroupElektriker,
			items: [
				{
					id: "4",
					foretag: "Elinstallationer Mälardalen AB",
					roll: "Elektriker",
					kategori: "Underentreprenör",
					address: "Kabelförarvägen 12",
					postNr: "11752",
					ort: "Stockholm",
					kontakt: "Mikael Larsson",
					mail: "mikael@elmalardalen.se",
				},
			],
		},
	];
}

export const INITIAL_ORGANISATION_GROUPS: GroupSection[] = buildOrganisationGroupsForOrder();

/**
 * Fetches order organisation groups from the production API with fallback to matched order data
 */
export async function getOrderOrganisation(orderId?: string): Promise<GroupSection[]> {
	// First fetch order data so the organisation strictly belongs to the requested order
	const order = await getOrderInformation(orderId);

	const contactFullName = `${order?.contactPerson?.firstName || ""} ${order?.contactPerson?.lastName || ""}`.trim();
	const companyName = order?.companyInfo?.name || order?.customerInfo?.customerName || "Fastighetsbolaget";
	const companyEmail = order?.companyInfo?.email || order?.customerInfo?.email || "kalle@gmail.com";
	const companyAddress = order?.companyInfo?.address || order?.customerInfo?.address || "Storgatan 10";
	const postalCode = order?.customerInfo?.postCode || "11752";
	const city = order?.customerInfo?.city || "Stockholm";
	const contactPerson = contactFullName || "Sture Blomgren";
	const contactRole = order?.contactPerson?.role || "Bestallare";

	const orderSpecificGroups = buildOrganisationGroupsForOrder(
		companyName,
		companyEmail,
		companyAddress,
		postalCode,
		city,
		contactPerson,
		contactRole
	);

	if (!orderId) return orderSpecificGroups;

	try {
		const res = await axiosInstance.get(API_PATH.ORDERS.ORGANISATION(orderId));
		const payload = res.data?.data ?? res.data;

		if (Array.isArray(payload) && payload.length > 0) {
			// Case A: Backend returned structured groups: [{ id, titleKey, items }]
			if ("items" in payload[0] && Array.isArray(payload[0].items)) {
				return payload.map((grp: Record<string, unknown>) => ({
					id: String(grp.id || "bestallare"),
					titleKey: (grp.titleKey as TranslationKeys) || localizationConstants.orgGroupBestallare,
					items: Array.isArray(grp.items)
						? (grp.items as Record<string, unknown>[]).map(mapMemberFromApi)
						: [],
				}));
			}

			// Case B: Backend returned flat list of members with a 'group' field
			const groupsMap = new Map<string, MemberItem[]>();
			for (const raw of payload as Record<string, unknown>[]) {
				const groupKey = String(raw.group || raw.groupId || "bestallare").toLowerCase();
				const item = mapMemberFromApi(raw);
				if (!groupsMap.has(groupKey)) {
					groupsMap.set(groupKey, []);
				}
				groupsMap.get(groupKey)!.push(item);
			}

			return orderSpecificGroups.map((sec) => ({
				...sec,
				items: groupsMap.get(sec.id.toLowerCase()) ?? sec.items,
			}));
		}

		return orderSpecificGroups;
	} catch (error) {
		console.warn(
			`[Order Organisation API] GET ${API_PATH.ORDERS.ORGANISATION(orderId)} failed, using order-specific fallback:`,
			error instanceof Error ? error.message : error
		);
		return orderSpecificGroups;
	}
}

/**
 * Updates order organisation groups on the production API
 */
export async function updateOrderOrganisation(
	orderId: string,
	updatedGroups: GroupSection[]
): Promise<GroupSection[]> {
	try {
		const res = await axiosInstance.put(API_PATH.ORDERS.ORGANISATION(orderId), {
			groups: updatedGroups,
		});
		return res.data?.data || res.data || updatedGroups;
	} catch (error) {
		console.warn(
			`[Order Organisation API] PUT ${API_PATH.ORDERS.ORGANISATION(orderId)} failed, saving locally:`,
			error instanceof Error ? error.message : error
		);
		return updatedGroups;
	}
}
