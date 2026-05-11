import { useState, useEffect, useRef } from "react";
import { SelectProps } from "./Select.types";

const Select: React.FC<SelectProps> = ({
  className,
  options,
  onChange,
  value,
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  const ChevronDownIcon = () => (
    <svg
      className="w-6 h-6 pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );

  const handleDropdown = () => {
    setIsDropdownVisible((prev) => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative cursor-context-menu bg-white rounded-lg text-[#FF6600] font-bold content-secondary-size text-center ${className}`}
    >
      <div
        onClick={handleDropdown}
        className="flex justify-between gap-2 items-center py-2 px-6"
      >
        <div className="flex gap-2">
          {options.filter((item) => item.value === value)[0]?.icon && (
            <img
              src={options.filter((item) => item.value === value)[0]?.icon}
              width={24}
              height={24}
            />
          )}
          {options.filter((item) => item.value === value)[0]?.label}
        </div>
        <ChevronDownIcon />
      </div>
      <div
        className={`absolute z-50 bg-white rounded-lg ${
          isDropdownVisible ? "" : "hidden"
        } w-full border`}
      >
        {options.map((item, key) => (
          <div
            key={key}
            className={`py-2 px-6 ${
              item.value === value ? "bg-[#FF6600] text-white" : ""
            } hover:bg-[#FF6600] hover:text-white`}
            onClick={() => {
              setIsDropdownVisible(false);
              onChange(item.value);
            }}
          >
            <div className="flex gap-2">
              {item.icon && <img src={item.icon} width={24} height={24} />}
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
