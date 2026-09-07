"use client";

import { RecordNavRow } from "@/components/layout/navigation";
import { ORDER_MODULE_BASE_URL } from "@/features/orders/data/orderNav.config";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderOpenedSections } from "./components/OrderOpenedSections";
import { useOrderOpened } from "./hooks/useOrderOpened";

function sanitizeText(input?: string): string {
  if (!input) return "";
  return input.replace(/[<>'"`]/g, "").trim();
}

export interface OrderOpenedPageProps {
  orderId?: string;
}

export function OrderOpenedPage({ orderId }: OrderOpenedPageProps) {
  const { orderData, updateOrderData, isLoading } = useOrderOpened(orderId);
  const t = useTranslate();

  const rawSerialNo = orderData.orderDetails.serialNo || orderData.id || "";
  const serialNo = sanitizeText(rawSerialNo);
  const recordTitle = serialNo
    ? `${t(localizationConstants.order)} ${serialNo}`
    : t(localizationConstants.order);

  return (
    <div className="flex h-full flex-col bg-white relative overflow-hidden">
      {/* Main Content Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="w-full space-y-6">
          {/* Record Back Navigation Bar */}
          <RecordNavRow
            title={recordTitle}
            backHref={`${ORDER_MODULE_BASE_URL}/overview`}
            className="pt-0"
            titleClassName="font-sans text-2xl leading-8 tracking-normal align-middle"
            backButtonClassName="mt-[5px]"
          />

          {/* Sections with Tabs */}
          <div className="ml-7">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-9 w-48 bg-zinc-200" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Skeleton className="h-56 w-full bg-zinc-200 rounded-lg" />
                  <Skeleton className="h-56 w-full bg-zinc-200 rounded-lg" />
                  <Skeleton className="h-56 w-full bg-zinc-200 rounded-lg" />
                  <Skeleton className="h-56 w-full bg-zinc-200 rounded-lg" />
                </div>
              </div>
            ) : (
              <OrderOpenedSections
                data={orderData}
                onUpdateData={updateOrderData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
