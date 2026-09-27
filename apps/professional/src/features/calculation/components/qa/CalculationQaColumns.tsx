"use client";

import { QAThreadCard } from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { CalculationQaBoardState } from "../../hooks/useCalculationQaBoard";
import {
	CALCULATION_QA_ARCHIVE_CARD_LABELS,
	CALCULATION_QA_CARD_LABELS,
	CALCULATION_QA_COLUMNS,
} from "../../constants/calculationQa.config";
import { formatQaDate } from "../../constants/calculationQaDate";
import type { CalculationQuestion } from "../../types/calculationQa";

export interface CalculationQaColumnsProps {
	board: CalculationQaBoardState;
	archivedOnly: boolean;
	currentUserName: string;
	onRequestDelete: (question: CalculationQuestion) => void;
}

/** 
 * New / Opened / Answered columns rendering QAThreadCards for calculation Q&A.
 */
export function CalculationQaColumns({
	board,
	archivedOnly,
	currentUserName,
	onRequestDelete,
}: CalculationQaColumnsProps) {
	const t = useTranslate();
	const labels = archivedOnly
		? CALCULATION_QA_ARCHIVE_CARD_LABELS
		: CALCULATION_QA_CARD_LABELS;

	return (
		<div className="grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
			{CALCULATION_QA_COLUMNS.map((column) => {
				const items = board.inColumn(column.status, archivedOnly);
				const Icon = column.icon;

				return (
					<QAThreadColumn
						key={column.status}
						label={t(column.labelKey)}
						icon={<Icon size={24} className="shrink-0 text-zinc-950" aria-hidden />}
						count={items.length}
						showCount={column.showCount}
						emptyMessageKey={localizationConstants.calcQANoneInColumn}
						className={column.className}
					>
						{items.map((question) => (
							<QAThreadCard
								key={question.id}
								message={{
									id: question.id,
									sender: question.sender,
									company: question.company,
									badge: question.badge,
									message: question.message,
									date: formatQaDate(question.date, t),
									answered: question.status === "answered",
									answerUser: question.answerUser,
									answerBadge: question.answerBadge,
									answerText: question.answerText,
									replyText: question.replyText,
									answerDate: question.answerDate
										? formatQaDate(question.answerDate, t)
										: undefined,
								}}
								labels={labels}
								currentUserName={currentUserName}
								onSendReply={(id, text) =>
									board.reply(id, text, currentUserName)
								}
								onMarkAsRead={
									question.status === "new" ? board.markAsRead : undefined
								}
								onArchive={() => board.toggleArchive(question)}
								onDelete={() => onRequestDelete(question)}
							/>
						))}
					</QAThreadColumn>
				);
			})}
		</div>
	);
}

export default CalculationQaColumns;
