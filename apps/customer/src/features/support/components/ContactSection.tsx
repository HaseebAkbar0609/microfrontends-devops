import { Mail, MessageCircle, Phone } from "lucide-react";

const contacts = [
	{
		title: "Phone",
		value: "076000000",
		icon: Phone,
	},
	{
		title: "Email",
		value: "info@hantverkshjalpen.com",
		icon: Mail,
	},
	{
		title: "Chat: Öppet",
		value: "info@hantverkshjalpen.com",
		icon: MessageCircle,
	},
];

export function ContactSection() {
	return (
		<div className="mt-6">
			<h2 className="mb-12 text-3xl font-bold text-slate-900">
				Contact us
			</h2>

			<div className="flex gap-4">
				{contacts.map((item) => {
					const Icon = item.icon;

					return (
						<div
							key={item.title}
							className="w-[360px] rounded-md border border-slate-300 bg-white p-6"
						>
							<div className="flex flex-col items-center gap-8 text-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
									<Icon className="h-6 w-6 text-orange-500" />
								</div>

								<div className="flex flex-col gap-2">
									<h3 className="text-lg font-semibold text-slate-800">
										{item.title}
									</h3>

									<p className="text-sm text-slate-600">
										{item.value}
									</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}