import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ArticleEmptyText } from "./ArticleCard";

export interface ArticleTableColumn {
	label: TranslationKeys;
	/** Numbers are right-aligned so their digits line up. */
	numeric?: boolean;
}

interface ArticleTableProps {
	columns: ArticleTableColumn[];
	loading?: boolean;
	/** Said instead of rows when there are none; a load error passes its message here too. */
	emptyText: TranslationKeys;
	isEmpty: boolean;
	children: ReactNode;
}

/** The bordered table the Lager per depå, Transaktioner and Prishistorik tabs share. */
export function ArticleTable({ columns, loading, emptyText, isEmpty, children }: ArticleTableProps) {
	if (loading) {
		return (
			<div className="grid gap-2">
				{Array.from({ length: 4 }, (_, index) => (
					<Skeleton key={index} className="h-10 w-full" />
				))}
			</div>
		);
	}
	if (isEmpty) return <ArticleEmptyText text={emptyText} />;

	return (
		<div className="overflow-x-auto rounded-lg border border-slate-200">
			<Table>
				<TableHeader>
					<TableRow className="bg-slate-50">
						{columns.map((column) => (
							<TableHead
								key={column.label}
								className={cn("text-xs font-medium text-slate-600", column.numeric && "text-right")}
							>
								<Translate text={column.label} />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>{children}</TableBody>
			</Table>
		</div>
	);
}
