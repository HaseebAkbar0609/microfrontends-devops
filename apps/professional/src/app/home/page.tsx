"use client";

import { useEffect } from "react";

import { getProfileAPIAction, type UserProfile } from "@/api-actions";
import Dashboard from "@/features/widgetdashboard/components/Dashboard";
import { useAuthStatus, type Company, type User } from "@/context/AuthContext";
import { authStorage } from "@/lib/authStorage";

function mapProfileToUser(
	profile: UserProfile,
	previous: User | null,
): User {
	const u = profile.user;
	return {
		id: u.id,
		email: u.email,
		first_name: u.first_name,
		last_name: u.last_name,
		city: previous?.city ?? "",
		country: previous?.country ?? "",
		phone_number: previous?.phone_number ?? "",
		postal_code: previous?.postal_code ?? "",
	};
}

function mapProfileToCompany(
	profile: UserProfile,
	previous: Company | null,
): Company {
	const c = profile.company;
	return {
		id: c.id,
		company_name: c.company_name,
		company_category: c.company_category,
		organization_number: c.organization_number,
		created_at: previous?.created_at ?? null,
		updated_at: previous?.updated_at ?? null,
	};
}

export default function HomePage() {
	const { isAuthenticated, isReady, setUser, setCompany } = useAuthStatus();

	useEffect(() => {
		if (!isReady || !isAuthenticated) return;

		let cancelled = false;

		(async () => {
			const result = await getProfileAPIAction();
			if (cancelled || !result.success || !result.data) return;

			const prevUser = authStorage.getUserData() as User | null;
			const prevCompany = authStorage.getCompanyData() as Company | null;

			const user = mapProfileToUser(result.data, prevUser);
			const company = mapProfileToCompany(result.data, prevCompany);

			authStorage.setUserData(user);
			authStorage.setCompanyData(company);
			setUser(user);
			setCompany(company);
		})();

		return () => {
			cancelled = true;
		};
	}, [isReady, isAuthenticated, setUser, setCompany]);

	return <Dashboard />;
}
