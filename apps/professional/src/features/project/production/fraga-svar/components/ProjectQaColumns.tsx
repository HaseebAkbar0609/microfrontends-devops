"use client";

import { QAThreadCard } from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ProjectQaBoardState } from "../hooks/useProjectQaBoard";
import {
	PROJECT_QA_ARCHIVE_CARD_LABELS,
	PROJECT_QA_CARD_LABELS,
	PROJECT_QA_COLUMNS,
} from "../projectQa.config";
import { formatQaDate } from "../qaDate";
import type { ProjectQuestion } from "../types";

export interface ProjectQaColumnsProps {
	board: ProjectQaBoardState;
	archivedOnly: boolean;
	currentUserName: string;
	onRequestDelete: (question: ProjectQuestion) => void;
}

/** New / Opened / Answered, each a shared column of shared cards. */
export function ProjectQaColumns({
	board,
	archivedOnly,
	currentUserName,
	onRequestDelete,
}: ProjectQaColumnsProps) {
	const t = useTranslate();
	const labels = archivedOnly
		? PROJECT_QA_ARCHIVE_CARD_LABELS
		: PROJECT_QA_CARD_LABELS;

	return (
		<div className="grid w-full grid-cols-1 items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
			{PROJECT_QA_COLUMNS.map((column) => {
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
								/* Only a new question can be marked as read, so
								   the item is not offered where it would do nothing. */
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

export default ProjectQaColumns;
