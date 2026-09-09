import { listPaymentMethods } from "@/server/paymentServiceClient";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const authorization = request.headers.get("authorization")?.trim() ?? "";
	const companyId = request.headers.get("x-company-id")?.trim() ?? "";
	if (!authorization.startsWith("Bearer ") || !companyId) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		return NextResponse.json(
			await listPaymentMethods({ authorization, companyId }),
		);
	} catch (error) {
		console.error(
			"Payment method list failed",
			error instanceof Error ? error.message : "Unknown error",
		);
		return NextResponse.json(
			{ message: "Unable to load payment methods" },
			{ status: 502 },
		);
	}
}
