import { redirect } from "next/navigation";

/** Business area entry — aligns with breadcrumb `/business`; list lives under offer. */
export default function BusinessIndexPage() {
	redirect("/setting");
}
