"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ChatMessage {
  id: string;
  senderId: "user" | "other";
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
}

const QA_CONTACT = {
  name: "Pelle Bygg",
  initials: "PB",
  responseTime: "~2h",
  contactPerson: "Peter Svensson",
};

const DUMMY_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    senderId: "other",
    senderName: "Stefan Eriksson",
    senderInitials: "SE",
    content:
      "Min laptop startar inte. Den visar bara en svart skärm när jag trycker på strömknappen.",
    timestamp: "2026-05-01 | 12:00 pm",
  },
  {
    id: "2",
    senderId: "user",
    senderName: "You",
    senderInitials: "Y",
    content:
      "Jag tror att ditt fönster inte fungerar, installera ett nytt fönster",
    timestamp: "2026-05-01 | 12:00 pm",
  },
  {
    id: "3",
    senderId: "other",
    senderName: "Stefan Eriksson",
    senderInitials: "SE",
    content:
      "Yes it should arrive at the destination port by 6 PM tomorrow. Let me know when it arrives.",
    timestamp: "2026-05-01 | 12:00 pm",
  },
];

interface QuestionsTabProps {
  projectId: string;
}

export function QuestionsTab({ projectId }: QuestionsTabProps) {
  const t = useTranslate();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(DUMMY_MESSAGES);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        senderId: "user",
        senderName: "You",
        senderInitials: "Y",
        content: message.trim(),
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setMessage("");
  };

  return (
    <div className="pb-10 space-y-4">
      {/* Contact header */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 flex items-center gap-3">
        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-[#18181B] flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {QA_CONTACT.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#09090B]">
            {QA_CONTACT.name}
          </p>
          <p className="text-xs text-[#71717A]">
            <Translate text={localizationConstants.projectResponseTimeLabel} />
            {": "}
            {QA_CONTACT.responseTime}
            {" • "}
            <Translate text={localizationConstants.projectContactPersonLabel} />
            {": "}
            {QA_CONTACT.contactPerson}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            className="h-8 px-3 text-sm font-medium bg-[#18181B] hover:bg-[#18181B]/90 text-white"
            onClick={() =>
              router.push(`/business/offer/${projectId}?tab=chat`)
            }
          >
            <Translate text={localizationConstants.projectBookMeetingLabel} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-sm font-medium border-[#E2E8F0] text-[#09090B]"
            onClick={() =>
              router.push(`/business/offer/${projectId}?tab=quote-list`)
            }
          >
            <Translate text={localizationConstants.projectViewOfferLabel} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 px-3 text-sm font-medium border-[#E2E8F0] text-[#09090B]"
            onClick={() =>
              router.push(
                `/business/offer/${projectId}/1?tab=company-info`,
              )
            }
          >
            <Translate
              text={localizationConstants.projectCompanyInfoBtnLabel}
            />
          </Button>
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center h-8 w-8 rounded-md text-[#71717A] hover:bg-slate-100 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat card */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
        {/* Messages */}
        <div className="p-5 space-y-5 h-90 overflow-y-auto [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {messages.map((msg) =>
            msg.senderId === "other" ? (
              /* Left — professional */
              <div key={msg.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#475569] text-xs font-semibold shrink-0">
                    {msg.senderInitials}
                  </div>
                  <span className="text-xs font-semibold text-[#09090B]">
                    {msg.senderName}
                  </span>
                </div>
                <div className="ml-9">
                  <div className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm text-[#09090B] max-w-lg">
                    {msg.content}
                  </div>
                  <p className="text-xs text-blue-500 mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ) : (
              /* Right — current user (gray bubble) */
              <div key={msg.id} className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#09090B]">
                    {msg.senderName}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-[#475569] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {msg.senderInitials}
                  </div>
                </div>
                <div className="mr-9">
                  <div className="bg-[#F1F5F9] rounded-lg px-3 py-2.5 text-sm text-[#09090B] max-w-lg">
                    {msg.content}
                  </div>
                  <p className="text-xs text-blue-500 mt-1 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-[#E2E8F0]">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t(localizationConstants.projectMessagePlaceholder)}
            className="min-h-20 rounded-none border-0 resize-none text-sm focus-visible:ring-0 px-4 py-3 border-b border-[#E2E8F0]"
          />
          <div className="flex items-center px-4 py-2 gap-2">
            <button
              type="button"
              className="cursor-pointer flex items-center gap-1.5 text-sm text-[#71717A] hover:text-[#09090B] transition-colors"
            >
              <Paperclip className="h-4 w-4" />
              <Translate text={localizationConstants.projectAttachLabel} />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 px-4 text-sm border-[#E2E8F0] text-[#09090B]"
                onClick={() => setMessage("")}
              >
                <Translate text={localizationConstants.projectCancelLabel} />
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-8 px-4 text-sm bg-[#18181B] hover:bg-[#18181B]/90 text-white"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Translate text={localizationConstants.projectSendLabel} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
