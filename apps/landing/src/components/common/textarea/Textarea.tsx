import { TextareaProps } from "./Textarea.types";

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  label,
  id,
  name,
  required = false,
  placeholder,
  size = "md",
  rows = 3,
  className,
}) => {
  const sizes: Record<string, string> = {
    sm: "px-3 py-2",
    md: "px-6 py-4",
  };

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {label && (
        <label className="" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative mt-2">
        <textarea
          id={id}
          rows={rows}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${sizes[size]} text-gray-700 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200 placeholder-gray-500`}
          required={required}
        />
      </div>
    </div>
  );
};

export default Textarea;
