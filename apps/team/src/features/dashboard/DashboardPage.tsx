import WidgetBoard from "./components/board/WidgetBoard";

export default function DashboardPage() {
	return (
		<div className="flex flex-1 flex-col bg-white px-4 py-6 sm:px-6">
			<WidgetBoard />
		</div>
	);
}
