"use client";

import { useState, Suspense } from "react";
import { notFound } from "next/navigation";
import {
	Archive,
	Filter,
	MoreVertical,
	Plus,
	Printer,
	Search,
	Trash2,
	Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModuleTabs } from "@/components/layout/navigation";
import { RecordNavRow } from "@/components/layout/navigation/RecordNavRow";
import { SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import { DESIGN_MODULE_BASE_URL } from "../data/designNav.config";
import { getDesignProjektRecord } from "../projektinformation/data/designProjektInfo.mock";
import { designProjektTabs } from "../projektinformation/designProjektNavConfig";
import { DesignRecordTitle } from "../projektinformation/components/DesignRecordTitle";
import {
	MOCK_RITNINGAR,
	MOCK_DOKUMENT,
	MOCK_FOTO,
	MOCK_ARKIVERADE,
} from "./data/designHandlingar.mock";
import type {
	HandlingArkiverad,
	HandlingDokument,
	HandlingFoto,
	HandlingRitning,
	HandlingarUploadForm,
} from "./types/designHandlingar";

// ---- LaddaUppModal ----

interface LaddaUppModalProps {
	open: boolean;
	form: HandlingarUploadForm;
	onBenamningChange: (val: string) => void;
	onFilChange: (name: string) => void;
	onSave: () => void;
	onClose: () => void;
}

function LaddaUppModal({
	open,
	form,
	onBenamningChange,
	onFilChange,
	onSave,
	onClose,
}: LaddaUppModalProps) {
	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>
						<Translate text={localizationConstants.designHandlingarLaddaUpp} />
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designEkonomiBenamning} />
						</label>
						<input
							type="text"
							value={form.benamning}
							onChange={(e) => onBenamningChange(e.target.value)}
							className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm focus:border-slate-400 focus:outline-none"
						/>
					</div>
					<div className="grid gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.designSidebarHandlingar} />
						</label>
						<label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
							<Upload className="h-5 w-5 text-slate-400" />
							<span className="text-sm text-slate-500">
								{form.filNamn ? (
									form.filNamn
								) : (
									<Translate text={localizationConstants.upload} />
								)}
							</span>
							<input
								type="file"
								className="hidden"
								onChange={(e) => {
									const f = e.target.files?.[0];
									if (f) onFilChange(f.name);
								}}
							/>
						</label>
						<span className="text-xs text-slate-400">
							<Translate text={localizationConstants.calcSkallKravFileTypes} />
						</span>
					</div>
				</div>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="cursor-pointer"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={onSave}
						className="cursor-pointer bg-zinc-900 text-white hover:bg-zinc-800"
					>
						<Translate text={localizationConstants.save} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---- RitningRow ----

interface RitningRowProps {
	item: HandlingRitning;
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function RitningRow({ item, onDelete, onArkivera }: RitningRowProps) {
	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				{item.ritningsNr}
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.kategori}</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.skapadAv}</td>
			<td className="w-12 px-2 py-3 text-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={() => onArkivera(item.id)}
							className="cursor-pointer"
						>
							<Archive className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.designEkonomiArkivera} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.projectListDeleteAction} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

// ---- RitningarContent ----

interface RitningarContentProps {
	items: HandlingRitning[];
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function RitningarContent({ items, onDelete, onArkivera }: RitningarContentProps) {
	if (items.length === 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.designHandlingarEmpty} />
			</div>
		);
	}
	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<table className="w-full">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50">
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designTidsplanDatumLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designHandlingarRitningsNr} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.orderKategoriLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.lblSkapadAv} />
						</th>
						<th className="w-12 px-2 py-3" />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<RitningRow
							key={item.id}
							item={item}
							onDelete={onDelete}
							onArkivera={onArkivera}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ---- DokumentRow ----

interface DokumentRowProps {
	item: HandlingDokument;
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function DokumentRow({ item, onDelete, onArkivera }: DokumentRowProps) {
	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				{item.dokumentNamn}
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.kategori}</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.skapadAv}</td>
			<td className="w-12 px-2 py-3 text-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={() => onArkivera(item.id)}
							className="cursor-pointer"
						>
							<Archive className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.designEkonomiArkivera} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.projectListDeleteAction} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

// ---- DokumentContent ----

interface DokumentContentProps {
	items: HandlingDokument[];
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function DokumentContent({ items, onDelete, onArkivera }: DokumentContentProps) {
	if (items.length === 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.designHandlingarEmpty} />
			</div>
		);
	}
	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<table className="w-full">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50">
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designTidsplanDatumLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designEkonomiBenamning} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.orderKategoriLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.lblSkapadAv} />
						</th>
						<th className="w-12 px-2 py-3" />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<DokumentRow
							key={item.id}
							item={item}
							onDelete={onDelete}
							onArkivera={onArkivera}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ---- FotoRow ----

interface FotoRowProps {
	item: HandlingFoto;
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function FotoRow({ item, onDelete, onArkivera }: FotoRowProps) {
	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				{item.fotoNr}
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.benamning}</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.skapadAv}</td>
			<td className="w-12 px-2 py-3 text-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={() => onArkivera(item.id)}
							className="cursor-pointer"
						>
							<Archive className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.designEkonomiArkivera} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.projectListDeleteAction} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

// ---- FotoContent ----

interface FotoContentProps {
	items: HandlingFoto[];
	onDelete: (id: string) => void;
	onArkivera: (id: string) => void;
}

function FotoContent({ items, onDelete, onArkivera }: FotoContentProps) {
	if (items.length === 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.designHandlingarEmpty} />
			</div>
		);
	}
	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<table className="w-full">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50">
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designTidsplanDatumLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designHandlingarFoto} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designEkonomiBenamning} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.lblSkapadAv} />
						</th>
						<th className="w-12 px-2 py-3" />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<FotoRow
							key={item.id}
							item={item}
							onDelete={onDelete}
							onArkivera={onArkivera}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}

// ---- ArkiveradRow ----

interface ArkiveradRowProps {
	item: HandlingArkiverad;
	onDelete: (id: string) => void;
}

function ArkiveradRow({ item, onDelete }: ArkiveradRowProps) {
	return (
		<tr className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
			<td className="px-4 py-3 text-sm text-slate-700">{item.datum}</td>
			<td className="px-4 py-3 text-sm font-semibold text-slate-900">
				{item.type}
			</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.benamning}</td>
			<td className="px-4 py-3 text-sm text-slate-700">{item.skapadAv}</td>
			<td className="w-12 px-2 py-3 text-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 cursor-pointer text-slate-400 hover:text-slate-900"
						>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-40">
						<DropdownMenuItem
							onClick={() => onDelete(item.id)}
							className="cursor-pointer text-red-600 focus:text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							<Translate text={localizationConstants.projectListDeleteAction} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</td>
		</tr>
	);
}

// ---- ArkiveradContent ----

interface ArkiveradContentProps {
	items: HandlingArkiverad[];
	onDelete: (id: string) => void;
}

function ArkiveradContent({ items, onDelete }: ArkiveradContentProps) {
	if (items.length === 0) {
		return (
			<div className="rounded-md border border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.designHandlingarEmpty} />
			</div>
		);
	}
	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<table className="w-full">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50">
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designTidsplanDatumLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.orderTypLabel} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.designEkonomiBenamning} />
						</th>
						<th className="px-4 py-3 text-left text-xs font-medium text-slate-500">
							<Translate text={localizationConstants.lblSkapadAv} />
						</th>
						<th className="w-12 px-2 py-3" />
					</tr>
				</thead>
				<tbody>
					{items.map((item) => (
						<ArkiveradRow key={item.id} item={item} onDelete={onDelete} />
					))}
				</tbody>
			</table>
		</div>
	);
}

// ---- HandlingarListContent ----

interface HandlingarListContentProps {
	ritningar: HandlingRitning[];
	dokument: HandlingDokument[];
	foto: HandlingFoto[];
	arkiverade: HandlingArkiverad[];
	onOpenModal: () => void;
	onDeleteRitning: (id: string) => void;
	onDeleteDokument: (id: string) => void;
	onDeleteFoto: (id: string) => void;
	onDeleteArkiverad: (id: string) => void;
	onArkiveraRitning: (id: string) => void;
	onArkiveraDokument: (id: string) => void;
	onArkiveraFoto: (id: string) => void;
}

function HandlingarListContent({
	ritningar,
	dokument,
	foto,
	arkiverade,
	onOpenModal,
	onDeleteRitning,
	onDeleteDokument,
	onDeleteFoto,
	onDeleteArkiverad,
	onArkiveraRitning,
	onArkiveraDokument,
	onArkiveraFoto,
}: HandlingarListContentProps) {
	const t = useTranslate();
	const [search, setSearch] = useState("");

	return (
		<div className="flex flex-col gap-4 px-6 pt-4 pb-8">
			<div className="flex items-center gap-3">
				<div className="relative flex-1">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm focus:border-slate-400 focus:outline-none"
					/>
				</div>
				<Button
					type="button"
					variant="outline"
					className="h-10 cursor-pointer gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
				>
					<Filter className="h-4 w-4" />
					<Translate text={localizationConstants.calcQAFilter} />
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon"
					onClick={() => window.print()}
					aria-label={t(localizationConstants.projectListPrint)}
					className="h-10 w-10 cursor-pointer rounded-md border-slate-200 text-slate-700 hover:bg-slate-50"
				>
					<Printer className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					onClick={onOpenModal}
					className="h-10 cursor-pointer gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.designHandlingarLaddaUpp} />
				</Button>
			</div>

			<Suspense fallback={null}>
				<SectionTabs
					items={[
						{
							id: "ritningar",
							labelKey: localizationConstants.orderHandlingarSubtabRitningar,
						},
						{
							id: "dokument",
							labelKey: localizationConstants.tabDokument,
						},
						{
							id: "foto",
							labelKey: localizationConstants.designHandlingarFoto,
						},
						{
							id: "arkiverade",
							labelKey: localizationConstants.designHandlingarArkiverade,
						},
					]}
					ariaLabel={t(localizationConstants.designSidebarHandlingar)}
				>
					<TabsContent value="ritningar" className="mt-4">
						<RitningarContent
							items={ritningar}
							onDelete={onDeleteRitning}
							onArkivera={onArkiveraRitning}
						/>
					</TabsContent>
					<TabsContent value="dokument" className="mt-4">
						<DokumentContent
							items={dokument}
							onDelete={onDeleteDokument}
							onArkivera={onArkiveraDokument}
						/>
					</TabsContent>
					<TabsContent value="foto" className="mt-4">
						<FotoContent
							items={foto}
							onDelete={onDeleteFoto}
							onArkivera={onArkiveraFoto}
						/>
					</TabsContent>
					<TabsContent value="arkiverade" className="mt-4">
						<ArkiveradContent items={arkiverade} onDelete={onDeleteArkiverad} />
					</TabsContent>
				</SectionTabs>
			</Suspense>
		</div>
	);
}

// ---- DesignHandlingarPage ----

export interface DesignHandlingarPageProps {
	projektId: string;
}

export function DesignHandlingarPage({ projektId }: DesignHandlingarPageProps) {
	const found = getDesignProjektRecord(projektId);
	const t = useTranslate();
	const [modalOpen, setModalOpen] = useState(false);
	const [uploadForm, setUploadForm] = useState<HandlingarUploadForm>({
		benamning: "",
		filNamn: "",
	});
	const [ritningar, setRitningar] = useState<HandlingRitning[]>(MOCK_RITNINGAR);
	const [dokument, setDokument] = useState<HandlingDokument[]>(MOCK_DOKUMENT);
	const [foto, setFoto] = useState<HandlingFoto[]>(MOCK_FOTO);
	const [arkiverade, setArkiverade] = useState<HandlingArkiverad[]>(MOCK_ARKIVERADE);

	if (!found) notFound();

	const handleSaveUpload = () => {
		if (uploadForm.benamning) {
			const newItem: HandlingRitning = {
				id: `r${Date.now()}`,
				datum: new Date().toLocaleDateString("sv-SE"),
				ritningsNr: uploadForm.filNamn || "-",
				kategori: "-",
				skapadAv: "",
			};
			setRitningar((prev) => [...prev, newItem]);
		}
		setUploadForm({ benamning: "", filNamn: "" });
		setModalOpen(false);
		showToast("success", t(localizationConstants.save));
	};

	const handleDeleteRitning = (id: string) =>
		setRitningar((prev) => prev.filter((i) => i.id !== id));

	const handleDeleteDokument = (id: string) =>
		setDokument((prev) => prev.filter((i) => i.id !== id));

	const handleDeleteFoto = (id: string) =>
		setFoto((prev) => prev.filter((i) => i.id !== id));

	const handleDeleteArkiverad = (id: string) =>
		setArkiverade((prev) => prev.filter((i) => i.id !== id));

	const handleArkivera = (id: string, source: "ritning" | "dokument" | "foto") => {
		if (source === "ritning") {
			const item = ritningar.find((i) => i.id === id);
			if (item) {
				setArkiverade((prev) => [
					...prev,
					{
						id: `a${Date.now()}`,
						datum: item.datum,
						type: item.ritningsNr,
						benamning: item.kategori,
						skapadAv: item.skapadAv,
					},
				]);
				setRitningar((prev) => prev.filter((i) => i.id !== id));
			}
		} else if (source === "dokument") {
			const item = dokument.find((i) => i.id === id);
			if (item) {
				setArkiverade((prev) => [
					...prev,
					{
						id: `a${Date.now()}`,
						datum: item.datum,
						type: item.dokumentNamn,
						benamning: item.kategori,
						skapadAv: item.skapadAv,
					},
				]);
				setDokument((prev) => prev.filter((i) => i.id !== id));
			}
		} else {
			const item = foto.find((i) => i.id === id);
			if (item) {
				setArkiverade((prev) => [
					...prev,
					{
						id: `a${Date.now()}`,
						datum: item.datum,
						type: item.fotoNr,
						benamning: item.benamning,
						skapadAv: item.skapadAv,
					},
				]);
				setFoto((prev) => prev.filter((i) => i.id !== id));
			}
		}
	};

	return (
		<div className="flex h-full flex-col">
			<div className="shrink-0 border-b border-slate-200 bg-white px-5">
				<RecordNavRow
					title={
						<DesignRecordTitle
							projektNr={found.projektNr}
							sectionKey={localizationConstants.designSidebarHandlingar}
						/>
					}
					backHref={`${DESIGN_MODULE_BASE_URL}/oversikt`}
				/>
				<div className="mt-3 -mb-px">
					<ModuleTabs items={designProjektTabs(projektId)} />
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				<LaddaUppModal
					open={modalOpen}
					form={uploadForm}
					onBenamningChange={(val) =>
						setUploadForm((prev) => ({ ...prev, benamning: val }))
					}
					onFilChange={(name) =>
						setUploadForm((prev) => ({ ...prev, filNamn: name }))
					}
					onSave={handleSaveUpload}
					onClose={() => setModalOpen(false)}
				/>

				<HandlingarListContent
					ritningar={ritningar}
					dokument={dokument}
					foto={foto}
					arkiverade={arkiverade}
					onOpenModal={() => setModalOpen(true)}
					onDeleteRitning={handleDeleteRitning}
					onDeleteDokument={handleDeleteDokument}
					onDeleteFoto={handleDeleteFoto}
					onDeleteArkiverad={handleDeleteArkiverad}
					onArkiveraRitning={(id) => handleArkivera(id, "ritning")}
					onArkiveraDokument={(id) => handleArkivera(id, "dokument")}
					onArkiveraFoto={(id) => handleArkivera(id, "foto")}
				/>
			</div>
		</div>
	);
}

export default DesignHandlingarPage;
