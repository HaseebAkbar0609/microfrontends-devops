export type RotOwner = {
	id: string;
	name: string;
	personalNumber: string;
	sharePercentage: number;
};

export type RotDetails = {
	id: string;
	designation: string;
	address: string;
	created: string;
	owners: RotOwner[];
};

export type GetRotRutDetailsParams = {
	id: string;
};

export type GetRotRutDetailsResponse = {
	success: boolean;
	data?: RotDetails;
	error?: string;
};

const DUMMY_DETAILS: Record<string, RotDetails> = {
	"1": {
		id: "1",
		designation: "Fastighet 1",
		address: "Stegatan 23",
		created: "2025 - 01 - 15",
		owners: [
			{ id: "o1", name: "Lars Andersson", personalNumber: "346 465 2416", sharePercentage: 50 },
			{ id: "o2", name: "Anna Andersson", personalNumber: "346 465 2416", sharePercentage: 50 },
		]
	},
};

export async function getRotRutDetailsAPIAction(params: GetRotRutDetailsParams): Promise<GetRotRutDetailsResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = DUMMY_DETAILS[params.id];
			if (data) {
				resolve({ success: true, data });
			} else {
				resolve({ success: false, error: "Rot-Rut property not found." });
			}
		}, 500); // Simulate network delay
	});
}
