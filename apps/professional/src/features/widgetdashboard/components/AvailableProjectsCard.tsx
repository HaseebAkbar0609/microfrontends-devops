import React from "react";
import { ArrowRight, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardAction, CardContent, CardTitle } from "@/components/ui/card";
import { GRAY } from "@/constants/colors";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export const AvailableProjectsCard = () => (
    <Card
        style={{ backgroundColor: GRAY[100] }}
        className="shadow-none gap-2.5"
    >
        <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <ArrowRight
                    size={16}
                    className="text-foreground"
                    strokeWidth={2}
                />
            </div>
            <CardAction>
                <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                >
                    <MoreVertical size={20} />
                </button>
            </CardAction>
        </CardHeader>
        <CardContent>
            <CardTitle className="text-base font-bold uppercase tracking-tight text-foreground">
                <Translate
                    text={localizationConstants.availableProjectsTitle}
                />
            </CardTitle>
            <p className="mt-1 text-sm text-gray-500">
                <Translate
                    text={localizationConstants.availableProjectsDescription}
                />
            </p>
        </CardContent>
    </Card>
);
