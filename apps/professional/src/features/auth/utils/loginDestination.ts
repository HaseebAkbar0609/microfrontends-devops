export function loginDestination(
	returnTo: string | null,
	requiresSubscription: boolean,
	salesOnboardingPending: boolean,
): string {
	if (returnTo) return returnTo;
	if (salesOnboardingPending) return "/admin/subscription?tab=payment";
	return requiresSubscription ? "/manage-plans" : "/home";
}
