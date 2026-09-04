import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLeadDetailsAPIAction } from "@/api-actions";
import type { UpdateLeadDetailsPayload } from "@/api-actions/leads/update-details";

export function useUpdateLeadDetails() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			leadId,
			payload,
		}: {
			leadId: string;
			payload: UpdateLeadDetailsPayload;
		}) => updateLeadDetailsAPIAction(leadId, payload),
		onSuccess: (_, { leadId }) => {
			queryClient.invalidateQueries({ queryKey: ["lead-by-id", leadId] });
			queryClient.invalidateQueries({ queryKey: ["leads-list"] });
		},
	});
}
