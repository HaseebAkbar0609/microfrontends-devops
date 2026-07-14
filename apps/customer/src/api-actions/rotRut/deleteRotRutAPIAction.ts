export type DeleteRotRutParams = {
	id: string;
};

export type DeleteRotRutResponse = {
	success: boolean;
	error?: string;
};

export async function deleteRotRutAPIAction(params: DeleteRotRutParams): Promise<DeleteRotRutResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			if (params.id) {
				resolve({ success: true });
			} else {
				resolve({ success: false, error: "Invalid ID." });
			}
		}, 500); // Simulate network delay
	});
}
