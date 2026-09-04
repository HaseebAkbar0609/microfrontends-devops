"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, parse, isValid } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  ORDER_CATEGORIES,
  ORDER_DATE_FORMAT,
} from "../../constants/orderOpened.constants";
import type { OrderInfo } from "../../types/orderOpened.types";

export interface EditOrderInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderInfo: OrderInfo;
  onSave: (updated: Partial<OrderInfo>) => void;
}

function parseSafeDate(dateStr?: string): Date | undefined {
  if (!dateStr || !dateStr.trim()) return undefined;
  const iso = parseISO(dateStr);
  if (isValid(iso)) return iso;
  const parsed = parse(dateStr.trim(), ORDER_DATE_FORMAT, new Date());
  if (isValid(parsed)) return parsed;
  return undefined;
}

export function EditOrderInfoModal({
  isOpen,
  onClose,
  orderInfo,
  onSave,
}: EditOrderInfoModalProps) {
  const t = useTranslate();
  const form = useForm<OrderInfo>({
    defaultValues: orderInfo,
  });

  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      form.reset(orderInfo);
    }
  }, [isOpen, orderInfo, form]);

  const onSubmit = (values: OrderInfo) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-full sm:max-w-154.75 min-h-90.5 bg-white border border-zinc-200 p-4 gap-4 rounded-lg shadow-lg"
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-0">
          <DialogTitle className="font-sans text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
            {t(localizationConstants.editOrderInfoModalTitle)}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t(localizationConstants.editOrderInfoModalTitle)}
          </DialogDescription>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-md text-slate-900 hover:bg-zinc-100 cursor-pointer"
            >
              <X className="h-5 w-5 text-slate-900" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="type"
                rules={{
                  required: t(localizationConstants.typeRequired),
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 justify-start">
                    <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                      {t(localizationConstants.typeLabel)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t(localizationConstants.typePlaceholder)}
                        className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="category"
                rules={{
                  required: t(localizationConstants.categoryRequired),
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 justify-start">
                    <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                      {t(localizationConstants.categoryLabel)}
                    </FormLabel>
                    <Select
                      value={field.value || ORDER_CATEGORIES.CLIENT}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 w-full bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900 [&_svg]:text-black [&_svg]:opacity-100">
                          <SelectValue
                            placeholder={t(
                              localizationConstants.selectCategoryPlaceholder,
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white border-zinc-200 text-slate-900">
                        <SelectItem value={ORDER_CATEGORIES.CLIENT}>
                          {t(localizationConstants.roleBestallare)}
                        </SelectItem>
                        <SelectItem value={ORDER_CATEGORIES.ONGOING}>
                          {t(localizationConstants.categoryLopande)}
                        </SelectItem>
                        <SelectItem value={ORDER_CATEGORIES.FIXED_PRICE}>
                          {t(localizationConstants.categoryFastPris)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-red-500 font-normal" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                rules={{
                  required: t(localizationConstants.departmentRequired),
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 justify-start">
                    <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                      {t(localizationConstants.departmentLabel)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t(
                          localizationConstants.departmentPlaceholder,
                        )}
                        className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="contractAmount"
                rules={{
                  required: t(localizationConstants.contractAmountRequired),
                }}
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 justify-start">
                    <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                      {t(localizationConstants.contractAmount)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t(
                          localizationConstants.contractAmountPlaceholder,
                        )}
                        className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-normal" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="offerNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1.5 justify-start">
                    <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                      {t(localizationConstants.offerNoLabel)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder={t(
                          localizationConstants.offerNrPlaceholder,
                        )}
                        className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <FormField
                control={form.control}
                name="startDate"
                rules={{
                  required: t(localizationConstants.startDateRequired),
                }}
                render={({ field }) => {
                  const dateValue = parseSafeDate(field.value);
                  return (
                    <FormItem className="flex flex-col gap-1.5 justify-start">
                      <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                        {t(localizationConstants.orderStart)}
                      </FormLabel>
                      <Popover open={startOpen} onOpenChange={setStartOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-10 border-zinc-200 bg-white text-slate-900 hover:bg-slate-50 cursor-pointer"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-black shrink-0" />
                              {dateValue ? (
                                format(dateValue, ORDER_DATE_FORMAT)
                              ) : (
                                <span className="text-slate-400">
                                  {t(localizationConstants.pickDatePlaceholder)}
                                </span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white border-zinc-200"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, ORDER_DATE_FORMAT) : "",
                              );
                              setStartOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-red-500 font-normal" />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="endDate"
                rules={{
                  required: t(localizationConstants.endDateRequired),
                }}
                render={({ field }) => {
                  const dateValue = parseSafeDate(field.value);
                  return (
                    <FormItem className="flex flex-col gap-1.5 justify-start">
                      <FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                        {t(localizationConstants.orderEnd)}
                      </FormLabel>
                      <Popover open={endOpen} onOpenChange={setEndOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-10 border-zinc-200 bg-white text-slate-900 hover:bg-slate-50 cursor-pointer"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-black shrink-0" />
                              {dateValue ? (
                                format(dateValue, ORDER_DATE_FORMAT)
                              ) : (
                                <span className="text-slate-400">
                                  {t(localizationConstants.pickDatePlaceholder)}
                                </span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white border-zinc-200"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={dateValue}
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, ORDER_DATE_FORMAT) : "",
                              );
                              setEndOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-red-500 font-normal" />
                    </FormItem>
                  );
                }}
              />
            </div>

            <DialogFooter className="flex gap-4 sm:justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-30 h-10 min-w-20 px-3 py-2 rounded-md border-zinc-200 text-slate-700 bg-transparent hover:bg-transparent cursor-pointer font-medium text-sm shadow-none"
              >
                {t(localizationConstants.buttonClose)}
              </Button>
              <Button
                type="submit"
                className="w-30 h-10 min-w-20 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{t(localizationConstants.buttonSave)}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
