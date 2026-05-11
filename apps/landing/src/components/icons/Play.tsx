import { IconProps } from "./Icon.types";

const Play: React.FC<IconProps> = ({
  width = 32,
  height = 32,
  color = "#FF914D",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <foreignObject x="-6.6" y="-6.6" width="93.2" height="93.2">
        <div
          style={{
            backdropFilter: "blur(3.3px)",
            clipPath: "url(#bgblur_0_2045_9011_clip_path)",
            height: "100%",
            width: "100%",
          }}
        ></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="6.6"
        cx="40"
        cy="40"
        r="40"
        fill={color}
      />
      <path
        d="M35.7839 51.668C34.0264 52.7865 31.7266 51.524 31.7266 49.4408V31.0592C31.7266 28.976 34.0264 27.7135 35.7839 28.832L50.2266 38.0227C51.8568 39.0601 51.8568 41.4399 50.2266 42.4773L35.7839 51.668Z"
        fill="white"
      />
      <defs>
        <clipPath
          id="bgblur_0_2045_9011_clip_path"
          transform="translate(6.6 6.6)"
        >
          <circle cx="40" cy="40" r="40" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Play;
