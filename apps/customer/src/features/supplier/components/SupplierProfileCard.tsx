import { Phone, Mail, Globe, Languages, Clock, Star, Bookmark } from "lucide-react";
import type { Supplier } from "../constants";

interface SupplierProfileCardProps {
	supplier: Supplier;
}

export function SupplierProfileCard({ supplier }: SupplierProfileCardProps) {
	return (
		<div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-6">
			{/* Avatar + info */}
			<div className="flex flex-col gap-3">
				{/* Avatar with online indicator */}
				<div className="relative w-20 h-20">
					<div className="w-20 h-20 bg-[#E4E4E7] rounded-full flex items-center justify-center">
						<span className="text-[#111721] text-3xl font-bold leading-none">
							{supplier.initials}
						</span>
					</div>
					{supplier.isOnline && (
						<div className="absolute bottom-0 right-0 w-6 h-6 bg-[#00C950] rounded-full border-2 border-white" />
					)}
				</div>

				{/* Status badges */}
				<div className="flex gap-1.5 flex-wrap">
					{supplier.isVerified && (
						<span className="px-2 py-0.5 text-xs font-medium text-[#008236] bg-[#F0FDF4] border border-[#B9F8CF] rounded-lg">
							Verifierad
						</span>
					)}
					{supplier.isTopSupplier && (
						<span className="px-2 py-0.5 text-xs font-medium text-[#FF8100] bg-[rgba(255,129,0,0.1)] border border-[rgba(255,129,0,0.2)] rounded-lg">
							Top Supplier
						</span>
					)}
				</div>

				{/* Name + subtitle */}
				<div>
					<h2 className="text-xl font-semibold text-[#0A0A0A] tracking-tight">
						{supplier.name}
					</h2>
					<p className="text-sm text-slate-500 mt-0.5">
						{supplier.category} • {supplier.location}
					</p>
				</div>

				{/* Star rating */}
				<div className="flex items-center gap-1.5">
					<div className="flex items-center gap-0.5">
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className="w-4 h-4 fill-[#FFB800] text-[#FFB800]"
							/>
						))}
					</div>
					<span className="text-sm font-semibold text-[#0A0A0A]">
						{supplier.rating.toFixed(1)}
					</span>
					<span className="text-sm text-slate-500">
						({supplier.reviewCount} recensioner)
					</span>
				</div>

				{/* Action buttons */}
				<div className="flex flex-col gap-2">
					<button className="w-full h-9 bg-[#1E293B] text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors">
						Bjud in till projekt
					</button>
					<div className="flex gap-2">
						<button className="flex-1 h-9 bg-white border border-black/10 rounded-lg text-sm font-medium text-[#0A0A0A] hover:bg-slate-50 transition-colors">
							Meddela
						</button>
						<button className="w-9 h-9 bg-white border border-black/10 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors shrink-0">
							<Bookmark className="w-4 h-4 text-[#0A0A0A]" />
						</button>
					</div>
				</div>
			</div>

			{/* Contact info */}
			<div className="flex flex-col gap-3 border-t border-slate-200 pt-6">
				<ContactRow
					icon={<Phone className="w-[18px] h-[18px] text-slate-400" />}
					label="Telefon"
					value={supplier.phone}
				/>
				<ContactRow
					icon={<Mail className="w-[18px] h-[18px] text-slate-400" />}
					label="Email"
					value={supplier.email}
				/>
				<ContactRow
					icon={<Globe className="w-[18px] h-[18px] text-slate-400" />}
					label="Website"
					value={supplier.website}
					isLink
				/>
				<ContactRow
					icon={<Languages className="w-[18px] h-[18px] text-slate-400" />}
					label="Språk"
					value={supplier.languages}
				/>
				<ContactRow
					icon={<Clock className="w-[18px] h-[18px] text-slate-400" />}
					label="Svarstid"
					value={supplier.responseTime}
				/>
				<ContactRow
					icon={
						<div className="w-[18px] h-[18px] flex items-center justify-center">
							<div className="w-2.5 h-2.5 rounded-full bg-[#00C950]" />
						</div>
					}
					label="Tillgänglighet"
					value={supplier.lastActive}
				/>
			</div>

			{/* Stats */}
			<div className="flex flex-col gap-3 border-t border-slate-200 pt-6">
				<div className="grid grid-cols-2 gap-3">
					<div className="bg-[#F7F8FA] rounded-lg p-3">
						<p className="text-xl font-semibold text-[#0A0A0A] tracking-tight">
							{supplier.completedProjects}
						</p>
						<p className="text-xs text-slate-500">Genomförda</p>
					</div>
					<div className="bg-[#F7F8FA] rounded-lg p-3">
						<p className="text-xl font-semibold text-[#0A0A0A] tracking-tight">
							{supplier.ongoingProjects}
						</p>
						<p className="text-xs text-slate-500">Pågående</p>
					</div>
				</div>
				{supplier.hasRotRut && (
					<div className="bg-[#F7F8FA] rounded-lg p-3">
						<p className="text-xs text-slate-500">ROT/RUT</p>
						<p className="text-sm font-medium text-[#00A63E]">
							✓ Ja, godkänd
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

function ContactRow({
	icon,
	label,
	value,
	isLink = false,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
	isLink?: boolean;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="shrink-0 mt-0.5">{icon}</div>
			<div className="min-w-0">
				<p className="text-xs text-slate-500">{label}</p>
				{isLink ? (
					<a
						href={`https://${value}`}
						className="text-sm text-[#FF8100] hover:underline break-all"
						target="_blank"
						rel="noopener noreferrer"
					>
						{value}
					</a>
				) : (
					<p className="text-sm text-[#0A0A0A] break-all">{value}</p>
				)}
			</div>
		</div>
	);
}
