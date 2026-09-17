import { getBillingAccountStatus } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const result = await getBillingAccountStatus({ authorization, companyId });
		return result
			? NextResponse.json(result)
			: NextResponse.json({ message: "Billing account not found" }, { status: 404 });
	} catch (error) {
		console.error(
			"Billing account status failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to load billing status" },
			{ status: 502 },
		);
	}
}
