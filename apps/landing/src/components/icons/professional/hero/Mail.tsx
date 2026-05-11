import { IconProps } from "../../Icon.types";

const Mail: React.FC<IconProps> = ({
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
        d="M16.667 3.33334H3.33366C2.41318 3.33334 1.66699 4.07953 1.66699 5V15C1.66699 15.9205 2.41318 16.6667 3.33366 16.6667H16.667C17.5875 16.6667 18.3337 15.9205 18.3337 15V5C18.3337 4.07953 17.5875 3.33334 16.667 3.33334Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3337 5.83334L10.8587 10.5833C10.6014 10.7445 10.3039 10.83 10.0003 10.83C9.69673 10.83 9.39927 10.7445 9.14199 10.5833L1.66699 5.83334"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Mail;
