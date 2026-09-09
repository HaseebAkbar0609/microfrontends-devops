import { redirect } from "next/navigation";
import { MARKETING_BASE_HREF } from "@/features/marketing/constants/marketing.constants";

/**
 * `/module/business` has never had a page of its own. Marketing is the only
 * thing under it, so land there rather than 404 on a bookmarked URL.
 */
export default function Page() {
	redirect(MARKETING_BASE_HREF);
}
