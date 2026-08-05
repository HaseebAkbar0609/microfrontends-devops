"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ChevronUp, CirclePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { TimeRow } from "../constants/mockData";
import { TimeRowValues, timeRowSchema } from "../schemas/time.schema";
import {
	createWorkDay,
	getWorkDay,
	updateWorkDay,
} from "../services/timeService";
import AddedTimeTable from "./AddedTimeTable";
import EditTimeRowDialog from "./EditTimeRowDialog";
import TimeEntryFormFields from "./TimeEntryFormFields";

const LIST_ROUTE = "/tools/time";

const emptyValues = (date: string): TimeRowValues => ({
	date,
	start: "",
	end: "",
	type: "project",
	refNr: "",
	ata: false,
	ataNr: "",
	travelUnit: "time",
	travelValue: "",
	allowance: false,
	title: "",
	description: "",
});

const valuesToRow = (values: TimeRowValues, id: string): TimeRow => ({
	id,
	start: values.start,
	end: values.end,
	type: values.type,
	refNr: values.type === "overhead" ? "" : values.refNr,
	projectName: values.title || `Projekt ${values.refNr}`,
	ata: values.ata,
	ataNr: values.ata ? values.ataNr : "",
	travelUnit: values.travelUnit,
	travelValue: values.travelValue,
	allowance: values.allowance,
	title: values.title,
	description: values.description,
});

const RegisterTimePage = () => {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const editingDayId = searchParams.get("id");
	const [existingDay] = useState(() =>
		editingDayId ? getWorkDay(editingDayId) : undefined,
	);

	const [rows, setRows] = useState<TimeRow[]>(existingDay?.rows ?? []);
	const [editingRow, setEditingRow] = useState<TimeRow | null>(null);
	const form = useForm<TimeRowValues>({
		resolver: zodResolver(timeRowSchema),
		defaultValues: emptyValues(existingDay?.date ?? mockDate(0)),
	});

	const handleAddRow = form.handleSubmit((values) => {
		setRows((current) => [
			...current,
			valuesToRow(values, `temp-${crypto.randomUUID()}`),
		]);
		form.reset({ ...emptyValues(values.date) });
		showToast("success", t(localizationConstants.timeRowAddedToast));
	});

	const handleEditRow = (values: TimeRowValues) => {
		if (!editingRow) return;
		setRows((current) =>
			current.map((row) =>
				row.id === editingRow.id ? valuesToRow(values, row.id) : row,
			),
		);
		showToast("success", t(localizationConstants.timeRowSavedToast));
	};

	const handleDeleteRow = (row: TimeRow) => {
		setRows((current) => current.filter((item) => item.id !== row.id));
		showToast("success", t(localizationConstants.timeRowDeletedToast));
	};

	const handleSave = () => {
		if (rows.length === 0) return;
		const date = form.getValues("date") || mockDate(0);
		if (existingDay) {
			updateWorkDay(existingDay.id, { date, rows });
		} else {
			createWorkDay({
				// UI-state-only id; the backend generates real ids at integration
				id: `temp-${crypto.randomUUID()}`,
				date,
				status: "pending",
				rows,
			});
		}
		showToast("success", t(localizationConstants.timeSavedToast));
		router.push(LIST_ROUTE);
	};

	return (
		<div className="flex flex-col gap-5 p-6">
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => router.push(LIST_ROUTE)}
					className="h-8 w-8 rounded-md text-slate-700"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold text-slate-900">
					<Translate
						text={localizationConstants.timeRegisterButton}
					/>
				</h1>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<div className="flex items-center justify-between rounded-t-md bg-slate-100 px-5 py-3">
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.timeNewCard} />
					</span>
					<ChevronUp className="h-4 w-4 text-slate-400" />
				</div>
				<Form {...form}>
					<form
						onSubmit={handleAddRow}
						className="flex flex-col gap-4 px-5 py-4"
					>
						<TimeEntryFormFields form={form} />
						<div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push(LIST_ROUTE)}
								className="h-10 rounded-md border-slate-200 bg-slate-50 px-6 text-sm font-medium text-slate-900 hover:bg-slate-100"
							>
								<Translate
									text={localizationConstants.cancel}
								/>
							</Button>
							<Button
								type="submit"
								className="h-10 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<CirclePlus className="h-4 w-4" />
								<Translate
									text={localizationConstants.timeAddRow}
								/>
							</Button>
						</div>
					</form>
				</Form>
			</div>

			{rows.length > 0 && (
				<AddedTimeTable
					rows={rows}
					onEdit={setEditingRow}
					onDelete={handleDeleteRow}
				/>
			)}

			<div className="flex items-center justify-end gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(LIST_ROUTE)}
					className="h-11 rounded-md border-slate-200 bg-slate-50 px-8 text-sm font-medium text-slate-900 hover:bg-slate-100"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					onClick={handleSave}
					disabled={rows.length === 0}
					className="h-11 gap-2 rounded-md bg-slate-900 px-8 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Save className="h-4 w-4" />
					<Translate text={localizationConstants.save} />
				</Button>
			</div>

			<EditTimeRowDialog
				open={editingRow !== null}
				date={form.getValues("date")}
				editingRow={editingRow}
				onClose={() => setEditingRow(null)}
				onSave={handleEditRow}
			/>
		</div>
	);
};

export default RegisterTimePage;
