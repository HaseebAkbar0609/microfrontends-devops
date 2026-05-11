import { InputProps } from "./Input.types";

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  id,
  name,
  type = "text",
  required = false,
  placeholder,
  icon,
  size = "md",
  className,
}) => {
  const sizes: Record<string, string> = {
    sm: "px-3 py-2",
    md: "px-6 py-4",
  };

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {label && <label className="" htmlFor={id}>{label}</label>}
      <div className="relative mt-2">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${sizes[size]} ${
            icon ? "pr-12" : ""
          } text-gray-700 bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-200 placeholder-gray-500`}
          required={required}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
