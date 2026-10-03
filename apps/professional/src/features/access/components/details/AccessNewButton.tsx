"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_NEW_BASE_URL } from "../../data/accessNav.config";

/** "+ New Access Management" of the details frames: opens the new-access wizard (TFS-1105). */
export function AccessNewButton() {
	const router = useRouter();

	return (
		<Button type="button" className="h-10 cursor-pointer gap-2" onClick={() => router.push(ACCESS_NEW_BASE_URL)}>
			<Plus className="h-4 w-4" aria-hidden />
			<Translate text={localizationConstants.accessNewButton} />
		</Button>
	);
}
