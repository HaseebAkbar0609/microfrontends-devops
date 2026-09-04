import ProtocolViewPage from "@/features/my-pages/protocol/components/ProtocolViewPage";

export default async function Page({
	params,
}: {
	params: Promise<{ protocolId: string }>;
}) {
	const { protocolId } = await params;

	return (
		<div className="p-6">
			<ProtocolViewPage protocolId={protocolId} />
		</div>
	);
}
