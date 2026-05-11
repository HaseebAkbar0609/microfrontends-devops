import { redirect } from "next/navigation";

/** Quote list URL alias — canonical route is `/business/offer`. */
export default function BusinessQuoteAliasPage() {
	redirect("/business/offer");
}
