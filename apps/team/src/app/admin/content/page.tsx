import { redirect } from "next/navigation";
import { CONTENT_GROUP_IDS } from "@/features/content/constants/content.constants";
import { getContentGroupHref } from "@/features/content/constants/contentNav";

/** The prototype rendered a blank page here; land on the first group instead. */
export default function Page() {
	redirect(getContentGroupHref(CONTENT_GROUP_IDS[0]));
}
