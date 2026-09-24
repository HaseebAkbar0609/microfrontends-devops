import { useQuery } from "@tanstack/react-query";
import { adaptLicenseCatalog, getLicenseCatalog } from "../api/licenseCatalog.api";

export const useLicenseCatalog = () =>
	useQuery({
		queryKey: ["admin-licenses-catalog"],
		queryFn: () => getLicenseCatalog(),
		select: (res) => adaptLicenseCatalog(res.data),
	});
