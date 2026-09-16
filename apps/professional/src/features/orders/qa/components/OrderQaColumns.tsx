"use client";

import { QAThreadCard } from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { OrderQaBoardState } from "../hooks/useOrderQaBoard";
import {
	ORDER_QA_ARCHIVE_CARD_LABELS,
	ORDER_QA_CARD_LABELS,
	ORDER_QA_COLUMNS,
} from "../orderQa.config";
import { formatQaDate } from "../qaDate";
import type { OrderQuestion } from "../types";

export interface OrderQaColumnsProps {
	board: OrderQaBoardState;
	archivedOnly: boolean;
	currentUserName: string;
	onRequestDelete: (question: OrderQuestion) => void;
}

/** New / Opened / Answered, each a shared column of shared cards. */
export function OrderQaColumns({
	board,
	archivedOnly,
	currentUserName,
	onRequestDelete,
}: OrderQaColumnsProps) {
	const t = useTranslate();
	const labels = archivedOnly
		? ORDER_QA_ARCHIVE_CARD_LABELS
		: ORDER_QA_CARD_LABELS;

	return (
		<div className="grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
			{ORDER_QA_COLUMNS.map((column) => {
				const items = board.inColumn(column.status, archivedOnly);
				const Icon = column.icon;

				return (
					<QAThreadColumn
						key={column.status}
						label={t(column.labelKey)}
						icon={<Icon size={24} className="shrink-0 text-zinc-950" aria-hidden />}
						count={items.length}
						showCount={column.showCount}
						emptyMessageKey={localizationConstants.projectQaNoneInColumn}
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
									answerText: question.answerText,
									answerDate: question.answerDate
										? formatQaDate(question.answerDate, t)
										: undefined,
								}}
								labels={labels}
								currentUserName={currentUserName}
								onSendReply={(id, text) =>
									board.reply(id, text, currentUserName)
								}
								/* Only a new question can be marked as read */
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

export default OrderQaColumns;
