import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLeadAPIAction } from "@/api-actions";

export function useDeleteLead() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (leadId: string) => deleteLeadAPIAction(leadId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["leads-list"] });
		},
	});
}
