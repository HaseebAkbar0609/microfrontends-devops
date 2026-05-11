import { CheckboxProps } from "./Checkbox.types";

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  id,
  name,
  required = false,
  disabled = false,
  size = "lg",
  className,
  labelClassName,
}) => {
  const sizes: Record<string, string> = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-sm",
    lg: "w-6 h-6 text-base",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        disabled={disabled}
        className={`
            ${sizes[size]}
            appearance-none rounded border-3 border-gray-300 
            bg-white cursor-pointer transition-all duration-200
            hover:border-primary-400
            checked:border-primary-500
            focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1
            disabled:opacity-50 disabled:cursor-not-allowed
            relative
            before:content-['✓']
            before:absolute before:inset-0
            before:flex before:items-center before:justify-center
            before:text-white before:font-bold
            checked:before:text-primary-500
            before:opacity-0 before:transition-opacity before:duration-200
            checked:before:opacity-100
          `}
      />

      {label && (
        <label
          htmlFor={id}
          className={`
            text-sm cursor-pointer text-gray-700 leading-relaxed select-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
