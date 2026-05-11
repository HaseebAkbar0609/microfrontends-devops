import { IconProps } from "../../Icon.types";

const SmartPhone: React.FC<IconProps> = ({
  width = 32,
  height = 32,
  color = "#FF914D",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.167 1.66667H5.83366C4.91318 1.66667 4.16699 2.41286 4.16699 3.33333V16.6667C4.16699 17.5871 4.91318 18.3333 5.83366 18.3333H14.167C15.0875 18.3333 15.8337 17.5871 15.8337 16.6667V3.33333C15.8337 2.41286 15.0875 1.66667 14.167 1.66667Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 15H10.0083"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SmartPhone;
