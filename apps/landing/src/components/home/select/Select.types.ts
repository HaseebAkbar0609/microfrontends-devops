export interface SelectOption {
  value: string | number;
  label: string;
  icon?: string;
}

export interface SelectProps {
  className?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (data: string | number) => void;
}
