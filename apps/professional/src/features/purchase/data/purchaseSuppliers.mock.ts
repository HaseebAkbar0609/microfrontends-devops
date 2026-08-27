import type { PurchaseSupplierRow } from "../types/purchase.types";

/**
 * Sample suppliers for the module's supplier list.
 *
 * The Figma frame's own cells are unusable — Post nr and Ort both read
 * "Byggbolaget" and Mail/Telefon render the Typ/Kategori badges left over from
 * the overview frame it was copied from — so these follow the column headers.
 */
export const MOCK_PURCHASE_SUPPLIERS: PurchaseSupplierRow[] = [
	{
		id: "beijer",
		name: "Beijer Byggmaterial",
		orderer: "Byggbolaget",
		postalCode: "112 51",
		city: "Stockholm",
		email: "order@beijer.se",
		phone: "+46 8 555 120 00",
		status: "active",
	},
	{
		id: "stalpartner",
		name: "AB Stålpartner",
		orderer: "Byggbolaget",
		postalCode: "417 05",
		city: "Göteborg",
		email: "info@stalpartner.se",
		phone: "+46 31 742 33 10",
		status: "active",
	},
	{
		id: "byggmaterial",
		name: "Byggmaterial AB",
		orderer: "Fastighetsbolag",
		postalCode: "212 34",
		city: "Malmö",
		email: "kundtjanst@byggmaterial.se",
		phone: "+46 40 611 88 20",
		status: "active",
	},
	{
		id: "elektroimport",
		name: "Elektroimport AB",
		orderer: "Byggbolaget",
		postalCode: "753 23",
		city: "Uppsala",
		email: "sales@elektroimport.se",
		phone: "+46 18 430 55 070",
		status: "inactive",
	},
	{
		id: "nordisk-ventilation",
		name: "Nordisk Ventilation",
		orderer: "Fastighetsbolag",
		postalCode: "582 22",
		city: "Linköping",
		email: "kontakt@nordiskvent.se",
		phone: "+46 13 288 41 00",
		status: "active",
	},
	{
		id: "wholesaler-nord",
		name: "Grossist Nord",
		orderer: "Byggbolaget",
		postalCode: "903 27",
		city: "Umeå",
		email: "order@grossistnord.se",
		phone: "+46 90 155 62 30",
		status: "inactive",
	},
];
