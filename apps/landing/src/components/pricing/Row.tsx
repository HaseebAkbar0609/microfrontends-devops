import { formatNumber } from "@/lib/formatters";
import { useTranslation } from "react-i18next";

interface RowProps {
  label: string;
  value: number;
  currencyLabel: string;
}

export function Row({ label, value, currencyLabel }: RowProps) {
  const { i18n } = useTranslation();
  return (
    <li className="flex justify-between border-b border-border pb-3">
      <span>{label}</span>
      <span className="font-bold">
        {formatNumber(value, i18n.language)} {currencyLabel}
      </span>
    </li>
  );
}
