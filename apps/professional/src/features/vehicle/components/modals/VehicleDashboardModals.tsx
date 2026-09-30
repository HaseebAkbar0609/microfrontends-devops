"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	CheckCircle2,
	AlertTriangle,
	MapPin,
	KeyRound,
	BookOpen,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	VehicleDashboardData,
	VehicleModalType,
} from "../../types/vehicleDashboard.types";

interface VehicleDashboardModalsProps {
	activeModal: VehicleModalType;
	data: VehicleDashboardData;
	onClose: () => void;
	onAddVehicle: (payload: {
		regNumber: string;
		brandModel: string;
		driver?: string;
		notes?: string;
	}) => void;
	onRegisterService: (payload: {
		vehicleNumber: string;
		title: string;
		scheduledDate: string;
		estimatedCost?: number;
		notes?: string;
	}) => void;
	onAssignKey: (driverName: string, keyNumber: string) => void;
	onApproveLogbooks: () => void;
}

const addVehicleSchema = z.object({
	regNumber: z.string().min(1, localizationConstants.vehicleValidationRequired),
	brandModel: z.string().min(1, localizationConstants.vehicleValidationRequired),
	driver: z.string().optional(),
	notes: z.string().optional(),
});

type AddVehicleFormValues = z.infer<typeof addVehicleSchema>;

const registerServiceSchema = z.object({
	vehicleNumber: z.string().min(1, localizationConstants.vehicleValidationRequired),
	title: z.string().min(1, localizationConstants.vehicleValidationRequired),
	scheduledDate: z.string().min(1, localizationConstants.vehicleValidationRequired),
	estimatedCost: z.string().optional(),
	notes: z.string().optional(),
});

type RegisterServiceFormValues = z.infer<typeof registerServiceSchema>;

const assignKeySchema = z.object({
	keyNumber: z.string().min(1, localizationConstants.vehicleValidationRequired),
	driver: z.string().min(1, localizationConstants.vehicleValidationRequired),
});

type AssignKeyFormValues = z.infer<typeof assignKeySchema>;

export const VehicleDashboardModals: React.FC<VehicleDashboardModalsProps> = ({
	activeModal,
	data,
	onClose,
	onAddVehicle,
	onRegisterService,
	onAssignKey,
	onApproveLogbooks,
}) => {
	const t = useTranslate();
	const router = useRouter();

	// 1. Add Vehicle Form
	const addVehicleForm = useForm<AddVehicleFormValues>({
		resolver: zodResolver(addVehicleSchema),
		defaultValues: {
			regNumber: "",
			brandModel: "",
			driver: "",
			notes: "",
		},
	});

	// 2. Register Service Form
	const registerServiceForm = useForm<RegisterServiceFormValues>({
		resolver: zodResolver(registerServiceSchema),
		defaultValues: {
			vehicleNumber: "",
			title: "",
			scheduledDate: "",
			estimatedCost: "",
			notes: "",
		},
	});

	// 3. Assign Key Form
	const assignKeyForm = useForm<AssignKeyFormValues>({
		resolver: zodResolver(assignKeySchema),
		defaultValues: {
			keyNumber: "",
			driver: "",
		},
	});

	useEffect(() => {
		if (activeModal === "add_vehicle") {
			addVehicleForm.reset();
		} else if (activeModal === "register_service") {
			registerServiceForm.reset({
				vehicleNumber: "",
				title: "",
				scheduledDate: "",
				estimatedCost: "",
				notes: "",
			});
		} else if (activeModal === "new_key") {
			assignKeyForm.reset();
		}
	}, [activeModal, addVehicleForm, registerServiceForm, assignKeyForm]);

	const onAddVehicleSubmit = (values: AddVehicleFormValues) => {
		onAddVehicle({
			regNumber: values.regNumber.trim(),
			brandModel: values.brandModel.trim(),
			driver: values.driver?.trim() || undefined,
			notes: values.notes?.trim() || undefined,
		});
	};

	const onRegisterServiceSubmit = (values: RegisterServiceFormValues) => {
		onRegisterService({
			vehicleNumber: values.vehicleNumber.trim(),
			title: values.title.trim(),
			scheduledDate: values.scheduledDate,
			estimatedCost: values.estimatedCost ? Number(values.estimatedCost) : undefined,
			notes: values.notes?.trim() || undefined,
		});
	};

	const onAssignKeySubmit = (values: AssignKeyFormValues) => {
		onAssignKey(values.driver.trim(), values.keyNumber.trim());
	};

	return (
		<>
			{/* 1. Add Vehicle Modal (Shadcn Form) */}
			<Dialog
				open={activeModal === "add_vehicle"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.vehicleModalAddVehicleTitle} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.vehicleModalAddVehicleDesc} />
						</DialogDescription>
					</DialogHeader>
					<Form {...addVehicleForm}>
						<form
							onSubmit={addVehicleForm.handleSubmit(onAddVehicleSubmit)}
							className="space-y-4 py-2"
						>
							<FormField
								control={addVehicleForm.control}
								name="regNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldRegNumber} /> *
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderRegNumber)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addVehicleForm.control}
								name="brandModel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldBrandModel} /> *
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderBrandModel)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addVehicleForm.control}
								name="driver"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldDriver} />
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderDriver)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={addVehicleForm.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldNotes} />
										</FormLabel>
										<FormControl>
											<Textarea
												rows={2}
												placeholder={t(localizationConstants.vehiclePlaceholderNotes)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-2">
								<Button type="button" variant="outline" onClick={onClose}>
									<Translate text={localizationConstants.cancel} />
								</Button>
								<Button type="submit">
									<Translate text={localizationConstants.save} />
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* 2. Register Service Modal (Shadcn Form) */}
			<Dialog
				open={activeModal === "register_service"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.vehicleModalRegisterServiceTitle} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.vehicleModalRegisterServiceDesc} />
						</DialogDescription>
					</DialogHeader>
					<Form {...registerServiceForm}>
						<form
							onSubmit={registerServiceForm.handleSubmit(onRegisterServiceSubmit)}
							className="space-y-4 py-2"
						>
							<FormField
								control={registerServiceForm.control}
								name="vehicleNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicle} /> *
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={registerServiceForm.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldServiceType} /> *
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderServiceTitle)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-3">
								<FormField
									control={registerServiceForm.control}
									name="scheduledDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Translate text={localizationConstants.vehicleFieldDate} /> *
											</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={registerServiceForm.control}
									name="estimatedCost"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												<Translate text={localizationConstants.vehicleFieldCost} />
											</FormLabel>
											<FormControl>
												<Input type="number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={registerServiceForm.control}
								name="notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldNotes} />
										</FormLabel>
										<FormControl>
											<Textarea
												rows={2}
												placeholder={t(localizationConstants.vehiclePlaceholderNotes)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-2">
								<Button type="button" variant="outline" onClick={onClose}>
									<Translate text={localizationConstants.cancel} />
								</Button>
								<Button type="submit">
									<Translate text={localizationConstants.save} />
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* 3. Vehicle Map Modal */}
			<Dialog
				open={activeModal === "vehicle_map"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<MapPin className="h-5 w-5 text-blue-600" />
							<Translate text={localizationConstants.vehicleModalMapTitle} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.vehicleModalMapDesc} />
						</DialogDescription>
					</DialogHeader>
					<div className="rounded-lg border border-slate-200 bg-slate-900 text-white p-6 my-2 space-y-4">
						<div className="flex items-center justify-between text-xs">
							<span className="flex items-center gap-1.5 text-emerald-400">
								<span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
								{Math.max(0, data.drive.activeVehiclesCount - 1)}{" "}
								<Translate text={localizationConstants.vehicleMapStatusOnline} />
							</span>
							<span className="flex items-center gap-1.5 text-amber-400">
								<AlertTriangle className="h-3.5 w-3.5" />
								{data.drive.noGpsCount}{" "}
								<Translate text={localizationConstants.vehicleMapStatusOffline} />
							</span>
						</div>
						<div className="h-48 rounded-md bg-slate-800 border border-slate-700 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
							<MapPin className="h-8 w-8 text-blue-400 mb-2" />
							<p className="font-medium text-slate-200">
								<Translate text={localizationConstants.vehicleMapZoneTitle} />
							</p>
							<p className="text-xs text-slate-400 mt-1">
								{data.drive.activeVehiclesCount}{" "}
								<Translate text={localizationConstants.vehicleMapGeofenceStatus} />
							</p>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={onClose}>
							<Translate text={localizationConstants.confirmClose} />
						</Button>
						<Button
							onClick={() => {
								onClose();
								router.push("/module/production/vehicle/drive");
							}}
						>
							<Translate text={localizationConstants.vehicleTabDrive} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* 4. Logbook Modal */}
			<Dialog
				open={activeModal === "logbook"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-indigo-600" />
							<Translate text={localizationConstants.vehicleModalLogbookTitle} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.vehicleModalLogbookDesc} />
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-3 py-2">
						<div className="flex items-center justify-between rounded-md border border-slate-200 p-3 bg-slate-50">
							<div>
								<p className="font-medium text-sm text-slate-900">
									<Translate text={localizationConstants.vehicleLogbookTrip1Title} />
								</p>
								<p className="text-xs text-slate-500 mt-0.5">
									<Translate text={localizationConstants.vehicleLogbookTrip1Route} />
								</p>
							</div>
							<Badge
								variant="outline"
								className="text-amber-700 border-amber-300 bg-amber-50"
							>
								<Translate text={localizationConstants.vehicleServiceStatusPending} />
							</Badge>
						</div>
						<div className="flex items-center justify-between rounded-md border border-slate-200 p-3 bg-slate-50">
							<div>
								<p className="font-medium text-sm text-slate-900">
									<Translate text={localizationConstants.vehicleLogbookTrip2Title} />
								</p>
								<p className="text-xs text-slate-500 mt-0.5">
									<Translate text={localizationConstants.vehicleLogbookTrip2Route} />
								</p>
							</div>
							<Badge
								variant="outline"
								className="text-amber-700 border-amber-300 bg-amber-50"
							>
								<Translate text={localizationConstants.vehicleServiceStatusPending} />
							</Badge>
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button variant="outline" onClick={onClose}>
							<Translate text={localizationConstants.confirmClose} />
						</Button>
						<Button
							onClick={() => {
								onApproveLogbooks();
								onClose();
							}}
							className="gap-1.5"
						>
							<CheckCircle2 className="h-4 w-4" />
							<Translate text={localizationConstants.vehicleDriveApproveLogbooks} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* 5. New Key Modal (Shadcn Form) */}
			<Dialog
				open={activeModal === "new_key"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<KeyRound className="h-5 w-5 text-amber-600" />
							<Translate text={localizationConstants.vehicleModalNewKeyTitle} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.vehicleModalNewKeyDesc} />
						</DialogDescription>
					</DialogHeader>
					<Form {...assignKeyForm}>
						<form
							onSubmit={assignKeyForm.handleSubmit(onAssignKeySubmit)}
							className="space-y-4 py-2"
						>
							<FormField
								control={assignKeyForm.control}
								name="keyNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldKeyNumber} /> *
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderKeyNumber)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={assignKeyForm.control}
								name="driver"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											<Translate text={localizationConstants.vehicleFieldDriver} /> *
										</FormLabel>
										<FormControl>
											<Input
												placeholder={t(localizationConstants.vehiclePlaceholderDriver)}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="pt-2">
								<Button type="button" variant="outline" onClick={onClose}>
									<Translate text={localizationConstants.cancel} />
								</Button>
								<Button type="submit">
									<Translate text={localizationConstants.save} />
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			{/* 6. Add Machine Redirect Modal */}
			<Dialog
				open={activeModal === "add_machine"}
				onOpenChange={(open) => !open && onClose()}
			>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.vehicleActionAddMachine} />
						</DialogTitle>
						<DialogDescription>
							<Translate text={localizationConstants.machineOverviewTitle} />
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="pt-2">
						<Button variant="outline" onClick={onClose}>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							onClick={() => {
								onClose();
								router.push("/module/production/machine/handling");
							}}
						>
							<Translate text={localizationConstants.machineSidebarHandling} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
