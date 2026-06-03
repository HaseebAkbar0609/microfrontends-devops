import UserProfilePage from "@/features/settings/users/components/UserProfilePage";

export default async function EditUserPage({
	params,
}: {
	params: Promise<{ userId: string }>;
}) {
	const { userId } = await params;
	return <UserProfilePage mode="edit" userId={userId} />;
}
