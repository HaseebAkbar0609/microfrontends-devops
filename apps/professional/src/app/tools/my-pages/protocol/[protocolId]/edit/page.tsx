import ProtocolEditPage from "@/features/my-pages/protocol/components/ProtocolEditPage";

export default async function Page({
	params,
}: {
	params: Promise<{ protocolId: string }>;
}) {
	const { protocolId } = await params;

	return (
		<div className="p-6">
			<ProtocolEditPage protocolId={protocolId} />
		</div>
	);
}
