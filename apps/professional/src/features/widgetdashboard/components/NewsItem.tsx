import React from "react";
import { Clock } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface NewsItemProps {
    title: string;
    date: string;
    content: string;
}

export const NewsItem = ({ title, date, content }: NewsItemProps) => (
    <div className="border-b border-border py-3 last:border-0">
        <h4 className="text-base font-semibold text-secondary">{title}</h4>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
            <Clock size={16} className="text-gray-500"/>
            <Translate text={localizationConstants.activeOrders} />: {date}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{content}</p>
    </div>
);
