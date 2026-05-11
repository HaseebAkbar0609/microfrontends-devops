import { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  size = "md",
  type = "button",
  round = "default",
}) => {
  const sizes = {
    sm: "px-3 py-1.5",
    md: "px-4 py-2",
    lg: "px-6 py-3",
  };

  const rounds = {
    default: "rounded-md",
    full: "rounded-4xl",
  };

  return (
    <button
      type={type}
      className={`${rounds[round]} bg-primary-500 text-white ${sizes[size]} hover:bg-[#E8823D] transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
