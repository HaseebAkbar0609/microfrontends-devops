"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAPIAction } from "@/api-actions";
import { useAuthStatus } from "@/context/AuthContext";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

type LogoutConfirmDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function LogoutConfirmDialog({
	open,
	onOpenChange,
}: LogoutConfirmDialogProps) {
	const router = useRouter();
	const { clearSession } = useAuthStatus();
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const handleConfirm = async () => {
		onOpenChange(false);
		setIsLoggingOut(true);
		try {
			await logoutAPIAction({ clearSession });
			router.replace("/login");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.logoutConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate
							text={localizationConstants.logoutConfirmDescription}
						/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoggingOut}>
						<Translate text={localizationConstants.logoutCancelButton} />
					</AlertDialogCancel>
					<Button
						type="button"
						variant="destructive"
						disabled={isLoggingOut}
						onClick={handleConfirm}
					>
						<Translate
							text={
								isLoggingOut
									? localizationConstants.logoutSigningOut
									: localizationConstants.logoutConfirmButton
							}
						/>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
