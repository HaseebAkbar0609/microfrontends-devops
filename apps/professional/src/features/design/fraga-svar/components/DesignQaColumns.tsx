"use client";

import { QAThreadCard } from "@/components/common/QAThreadCard";
import { QAThreadColumn } from "@/components/common/QAThreadColumn";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_QA_ARCHIVE_CARD_LABELS,
	PROJECT_QA_CARD_LABELS,
	PROJECT_QA_COLUMNS,
} from "@/features/project/production/fraga-svar/projectQa.config";
import { formatQaDate } from "@/features/project/production/fraga-svar/qaDate";
import type { ProjectQuestion } from "@/features/project/production/fraga-svar/types";
import type { DesignQaBoardState } from "../hooks/useDesignQaBoard";

export interface DesignQaColumnsProps {
	board: DesignQaBoardState;
	archivedOnly: boolean;
	currentUserName: string;
	onRequestDelete: (question: ProjectQuestion) => void;
}

export function DesignQaColumns({
	board,
	archivedOnly,
	currentUserName,
	onRequestDelete,
}: DesignQaColumnsProps) {
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

export default DesignQaColumns;
