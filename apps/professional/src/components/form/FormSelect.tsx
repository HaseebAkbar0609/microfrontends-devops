import { Loader2, Search } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

export interface FormSelectOption {
  value: string;
  label: React.ReactNode;
  searchLabel?: string;
}

export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  placeholder?: string;
  options: FormSelectOption[];
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  messageClassName?: string;
  translateError?: (message: string) => string;
  /** Fires when the dropdown is scrolled near the bottom (e.g. load more options). */
  onSelectContentNearEnd?: () => void;
  selectContentFooter?: ReactNode;

  // Infinite scroll additions
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;

  // Search additions
  searchable?: boolean;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled,
  className,
  labelClassName,
  triggerClassName,
  contentClassName,
  messageClassName,
  translateError,
  onSelectContentNearEnd,
  selectContentFooter,
  hasMore,
  isLoadingMore,
  onLoadMore,
  searchable,
  onSearchChange,
  searchPlaceholder = "Search...",
}: FormSelectProps<TFieldValues, TName>) {
  const { t } = useTranslation();
  const lastNearEndAt = useRef(0);
  const [searchValue, setSearchValue] = useState("");

  const effectiveOnLoadMore = onLoadMore ?? onSelectContentNearEnd;

  const handleSelectContentScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      if (!effectiveOnLoadMore || (hasMore === false && !onSelectContentNearEnd)) return;
      const el = e.currentTarget;
      const threshold = 48;
      const currentScrollPos = el.scrollHeight - Math.ceil(el.scrollTop) - el.clientHeight;
      if (currentScrollPos > threshold) {
        return;
      }
      const now = Date.now();
      if (now - lastNearEndAt.current < 400) return;
      lastNearEndAt.current = now;
      effectiveOnLoadMore();
    },
    [effectiveOnLoadMore, hasMore, onSelectContentNearEnd]
  );

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    onSearchChange?.(val);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("grid", className)}>
          {label && (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              handleSearchChange("");
            }}
            onOpenChange={(open) => {
              if (!open) {
                handleSearchChange("");
              }
            }}
            value={field.value ?? ""}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className={cn("w-full h-10", triggerClassName)}>
                <SelectValue placeholder={<Translate text={placeholder ?? ""} />} />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              className={contentClassName}
              onViewportScroll={
                effectiveOnLoadMore ? handleSelectContentScroll : undefined
              }
            >
              {searchable && (
                <div className="sticky top-0 z-10 bg-popover px-2 py-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={searchPlaceholder}
                      className="h-9 w-full pl-8"
                      value={searchValue}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      // Prevent closing the dropdown when clicking inside the input
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}

              {isLoadingMore && (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}

              {selectContentFooter}
            </SelectContent>
          </Select>
          <FormMessage
            className={messageClassName}
            translate={translateError ?? t}
          />
        </FormItem>
      )}
    />
  );
}
