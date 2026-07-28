"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Trash2, CircleUserRound, ArrowUpDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Translate } from "@/utils/translation/translate";

import {
	getRegistrationSchema,
	RegistrationSchemaType,
} from "@/schemas/rotRut/registration.schema";
import { createRot, getOwners, type Owner, type RotPayload } from "@/api-actions/rotRut";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface CreateRotFormProps {
	projectId: string;
}

export const CreateRotForm = ({ projectId }: CreateRotFormProps) => {
	const { t } = useTranslation();
	const [owners, setOwners] = useState<Owner[]>([]);

	useEffect(() => {
		let cancelled = false;
		const fetchOwners = async () => {
			if (!projectId) return;
			try {
				const data = await getOwners(projectId, "rot");
				if (cancelled) return;
				setOwners(data);
			} catch (_error) {
				if (cancelled) return;
				toast.error(t(localizationConstants.errorDetailsFailed));
			}
		};
		void fetchOwners();
		return () => {
			cancelled = true;
		};
	}, [projectId, t]);

	const form = useForm<RegistrationSchemaType>({
		resolver: zodResolver(getRegistrationSchema(t)),
		defaultValues: {
			propertyId: "",
			address: "",
			firstName: "",
			lastName: "",
			sharePercentage: "",
			personalId: "",
			isCoOwner: false,
			coOwnerPersonalId: "",
		},
	});

	const mutation = useMutation({
		mutationFn: (data: RegistrationSchemaType) => {
			const payload: RotPayload = {
				propertyId: data.propertyId,
				address: data.address,
				ownerName: `${data.firstName} ${data.lastName}`.trim(),
				sharePercentage: Number(data.sharePercentage),
				personalId: data.personalId,
				isCoOwner: Boolean(data.isCoOwner),
				coOwnerPersonalId: data.isCoOwner && data.coOwnerPersonalId ? data.coOwnerPersonalId : undefined,
			};
			return createRot(projectId, payload);
		},
		onSuccess: (_data, variables) => {
			toast.success(t(localizationConstants.rotSavedSuccess));
			const newOwner: Owner = {
				id: crypto.randomUUID(),
				name: `${variables.firstName} ${variables.lastName}`.trim(),
				personalId: variables.personalId,
				share: `${variables.sharePercentage}%`,
			};
			setOwners((prev) => [...prev, newOwner]);

			form.setValue("firstName", "");
			form.setValue("lastName", "");
			form.setValue("sharePercentage", "");
			form.setValue("personalId", "");
			form.setValue("isCoOwner", false);
			form.setValue("coOwnerPersonalId", "");
		},
		onError: () => {
			toast.error(t(localizationConstants.rotSavedError));
		},
	});

	const onSubmit = (data: RegistrationSchemaType) => {
		mutation.mutate(data);
	};

	const removeOwner = (id: string) => {
		setOwners(owners.filter((o) => o.id !== id));
	};

	return (
		<div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50 font-inter">
			<Form {...form}>
				<form
					id="create-rot-form"
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col flex-1 h-full overflow-hidden"
				>
					{/* Page header */}
					<header className="px-6 pt-6 pb-2 flex flex-col gap-1 shrink-0 bg-slate-50">
						<div className="flex items-center gap-3">
							<Link
								href={projectId ? `/rotRut?projectId=${encodeURIComponent(projectId)}` : "/rotRut"}
								className="shrink-0 h-8 w-8 p-0 hover:bg-slate-100 rounded-full flex items-center justify-center transition-colors"
								aria-label="Back"
							>
								<ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={2} />
							</Link>
							<h1 className="font-sans text-2xl font-semibold text-slate-900 leading-none tracking-[-0.6px]">
								<Translate text={localizationConstants.createNew} />
							</h1>
						</div>
						<p className="font-sans text-sm font-normal text-slate-500 leading-5 tracking-normal pl-[44px]">
							<Translate text={localizationConstants.addDetailedInfo} />
						</p>
					</header>

					{/* Scrollable content */}
					<main className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
						<div className="w-full md:w-[calc(100%-44px)] max-w-[732px] space-y-6 pb-8 md:ml-[44px]">
							{/* Card 1: ROT details */}
							<Card className="border border-slate-200 shadow-none rounded-lg py-0 gap-0">
								<CardHeader className="border-b border-slate-200 px-6 h-14 flex items-center !py-0">
									<div className="flex items-center gap-2 text-slate-800">
										<CircleUserRound className="h-5 w-5" />
										<CardTitle className="text-base font-medium leading-6 font-inter">
											{t(localizationConstants.rotDetails)}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="px-6 py-4">
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="propertyId"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm text-slate-900 font-medium">
														{t(localizationConstants.propertyIdLabel)}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Kv skatan 23434"
															className="h-10 text-slate-700 text-sm border-slate-200"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="address"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-sm text-slate-900 font-medium">
														{t(localizationConstants.addressLabel)}
													</FormLabel>
													<FormControl>
														<Input
															placeholder="Stengatan 10, Spånga"
															className="h-10 text-slate-700 text-sm border-slate-200"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Card 2: Registration */}
							<Card className="border border-slate-200 shadow-none rounded-lg py-0 gap-0">
								<CardHeader className="border-b border-slate-200 px-6 h-14 flex items-center !py-0">
									<div className="flex items-center gap-2 text-slate-800">
										<CircleUserRound className="h-5 w-5" />
										<CardTitle className="text-base font-medium leading-6 font-inter">
											{t(localizationConstants.registration)}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="p-6">
									<div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
										<FormField
											control={form.control}
											name="firstName"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-700 font-semibold">
														{t(localizationConstants.firstNameLabel)}
													</FormLabel>
													<FormControl>
														<Input placeholder="Anna" className="h-10 border-slate-200" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="lastName"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-700 font-semibold">
														{t(localizationConstants.lastNameLabel)}
													</FormLabel>
													<FormControl>
														<Input placeholder="Andersson" className="h-10 border-slate-200" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="sharePercentage"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-700 font-semibold">
														{t(localizationConstants.sharePercentageLabel)}
													</FormLabel>
													<FormControl>
														<div className="relative">
															<Input
																type="number"
																min={1}
																max={100}
																placeholder="50"
																className="h-10 border-slate-200 pr-8"
																{...field}
															/>
															<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
																%
															</span>
														</div>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="personalId"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="text-slate-700 font-semibold">
														{t(localizationConstants.personalIdLabel)}
													</FormLabel>
													<FormControl>
														<Input placeholder="1716 3263 6548" className="h-10 border-slate-200" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="isCoOwner"
											render={({ field }) => (
												<FormItem className="flex flex-row items-center gap-2 space-y-0 pt-2 col-span-full">
													<FormControl>
														<Checkbox
															checked={field.value}
															onCheckedChange={field.onChange}
														/>
													</FormControl>
													<FormLabel className="text-slate-700 font-semibold cursor-pointer">
														{t(localizationConstants.isCoOwnerLabel)}
													</FormLabel>
												</FormItem>
											)}
										/>
										{form.watch("isCoOwner") && (
											<FormField
												control={form.control}
												name="coOwnerPersonalId"
												render={({ field }) => (
													<FormItem className="col-span-full md:col-span-1">
														<FormLabel className="text-slate-700 font-semibold">
															{t(localizationConstants.coOwnerPersonalIdLabel)}
														</FormLabel>
														<FormControl>
															<Input placeholder="199001011234" className="h-10 border-slate-200" {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
									</div>
									<div className="flex justify-start pt-4">
										<Button
											type="submit"
											disabled={mutation.isPending}
											className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px] px-6 h-10 font-medium rounded-lg gap-2"
										>
											<Save className="h-4 w-4" />
											{mutation.isPending ? t(localizationConstants.saving) : t(localizationConstants.save)}
										</Button>
									</div>
								</CardContent>
							</Card>

							{/* Card 3: Owner List */}
							<Card className="border border-slate-200 shadow-none rounded-xl py-0 gap-0 overflow-hidden">
								<CardHeader className="border-b border-slate-200 px-6 h-14 flex items-center !py-0">
									<div className="flex items-center gap-2 text-slate-800">
										<CircleUserRound className="h-5 w-5" />
										<CardTitle className="text-base font-medium leading-6 font-inter">
											{t(localizationConstants.ownerList)}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="px-6 pb-4">
									<Table className="border-b border-slate-200">
										<TableHeader>
											<TableRow className="border-b border-slate-200 hover:bg-transparent">
												<TableHead className="text-slate-500 font-medium py-4 px-6 h-auto">
													<div className="flex items-center gap-2">
														{t(localizationConstants.name)} <ArrowUpDown className="h-4 w-4" />
													</div>
												</TableHead>
												<TableHead className="text-slate-500 font-medium py-4 px-6 h-auto">
													<div className="flex items-center gap-2">
														{t(localizationConstants.personalId)} <ArrowUpDown className="h-4 w-4" />
													</div>
												</TableHead>
												<TableHead className="text-slate-500 font-medium py-4 px-6 h-auto">
													<div className="flex items-center gap-2">
														{t(localizationConstants.sharePercentage)} <ArrowUpDown className="h-4 w-4" />
													</div>
												</TableHead>
												<TableHead className="w-[80px] border-l border-slate-200"></TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{owners.length === 0 ? (
												<TableRow>
													<TableCell colSpan={4} className="text-center text-slate-500 py-8">
														{t(localizationConstants.noOwnersAdded)}
													</TableCell>
												</TableRow>
											) : (
												owners.map((owner) => (
													<TableRow
														key={owner.id}
														className="border-b border-slate-200 last:border-0 hover:bg-transparent"
													>
														<TableCell className="py-4 px-6 font-medium text-slate-900 font-sans">
															{owner.name}
														</TableCell>
														<TableCell className="py-4 px-6 text-slate-900 font-sans">
															{owner.personalId}
														</TableCell>
														<TableCell className="py-4 px-6 text-slate-900 font-sans">
															{owner.share}
														</TableCell>
														<TableCell className="py-4 px-4 border-l border-slate-200 align-middle">
															<Button
																type="button"
																variant="ghost"
																size="icon"
																className="h-8 w-8 bg-transparent hover:bg-slate-100 text-slate-600 rounded-md mx-auto flex"
																onClick={() => removeOwner(owner.id)}
															>
																<Trash2 className="h-4 w-4" />
															</Button>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</CardContent>
							</Card>
						</div>
					</main>

					<footer className="shrink-0 border-t border-slate-200 bg-white px-6 py-4 z-10">
						<div className="flex items-center justify-end gap-3">
							<Link href={projectId ? `/rotRut?projectId=${encodeURIComponent(projectId)}` : "/rotRut"}>
								<Button
									type="button"
									variant="outline"
									className="min-w-[120px] border-slate-200 text-slate-600 h-10 bg-transparent hover:bg-slate-100 font-medium"
								>
									{t(localizationConstants.cancel)}
								</Button>
							</Link>
							<Button
								type="submit"
								disabled={mutation.isPending}
								className="min-w-[120px] bg-slate-900 hover:bg-slate-800 text-white h-10 gap-2 font-medium"
							>
								<Save className="h-4 w-4" />
								{mutation.isPending ? t(localizationConstants.saving) : t(localizationConstants.save)}
							</Button>
						</div>
					</footer>
				</form>
			</Form>
		</div>
	);
};
