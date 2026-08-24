import CalculationDashboard from "@/features/calculation/components/CalculationDashboard";

export default function CalculationDashboardPage() {
    return (
        <div className="flex flex-1 flex-col bg-blue-gray-50">
            <div className="p-5 flex-1">
                <CalculationDashboard />
            </div>
        </div>
    );
}
