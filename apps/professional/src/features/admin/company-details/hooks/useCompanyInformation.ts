import { useQuery, useMutation } from "@tanstack/react-query";
import {
	getCompanyInformation,
	updateCompanyInformation,
} from "../api/companyInformation.api";

export const useCompanyInformation = () =>
	useQuery({
		queryKey: ["company-information"],
		queryFn: getCompanyInformation,
	});

export const useUpdateCompanyInformation = () =>
	useMutation({
		mutationFn: updateCompanyInformation,
	});
