import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createReference,
	deleteReference,
	getBankDetails,
	getCompanyInformation,
	getLeadManagement,
	getPresentation,
	getReferences,
	getReviews,
	replyToReview,
	updateBankDetails,
	updateCompanyInformation,
	updateLeadManagement,
	updatePresentation,
	updateReference,
} from "../api/companyInformation.api";

export const useCompanyInformation = () =>
	useQuery({
		queryKey: ["company-information"],
		queryFn: getCompanyInformation,
	});

export const useUpdateCompanyInformation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateCompanyInformation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["company-information"] });
		},
	});
};

export const useBankDetails = () =>
	useQuery({
		queryKey: ["company-information", "bank"],
		queryFn: getBankDetails,
	});

export const useUpdateBankDetails = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateBankDetails,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["company-information", "bank"] });
		},
	});
};

export const usePresentation = () =>
	useQuery({
		queryKey: ["company-information", "presentation"],
		queryFn: getPresentation,
	});

export const useUpdatePresentation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updatePresentation,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["company-information", "presentation"],
			});
		},
	});
};

export const useReferences = () =>
	useQuery({
		queryKey: ["company-information", "references"],
		queryFn: getReferences,
	});

const useInvalidateReferences = () => {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({
			queryKey: ["company-information", "references"],
		});
};

export const useCreateReference = () => {
	const invalidate = useInvalidateReferences();
	return useMutation({ mutationFn: createReference, onSuccess: invalidate });
};

export const useUpdateReference = () => {
	const invalidate = useInvalidateReferences();
	return useMutation({ mutationFn: updateReference, onSuccess: invalidate });
};

export const useDeleteReference = () => {
	const invalidate = useInvalidateReferences();
	return useMutation({ mutationFn: deleteReference, onSuccess: invalidate });
};

export const useReviews = () =>
	useQuery({
		queryKey: ["company-information", "reviews"],
		queryFn: getReviews,
	});

export const useReplyToReview = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: replyToReview,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["company-information", "reviews"],
			});
		},
	});
};

export const useLeadManagement = () =>
	useQuery({
		queryKey: ["company-information", "lead-management"],
		queryFn: getLeadManagement,
	});

export const useUpdateLeadManagement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateLeadManagement,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["company-information", "lead-management"],
			});
		},
	});
};
