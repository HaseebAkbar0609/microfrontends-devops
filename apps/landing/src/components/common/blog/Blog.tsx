import { BlogProps } from "./Blog.types";

const Blog: React.FC<BlogProps> = ({
  image,
  video,
  direction = "right",
  title,
  description,
  button,
}) => {
  return (
    <div
      className={`flex gap-10 ${
        direction === "right"
          ? "flex-col md:flex-row"
          : "flex-col md:flex-row-reverse"
      }`}
    >
      <div className="flex-3/12 overflow-hidden p-2 rounded-xl">
        {video ? (
          <div className="w-full h-full rounded-xl overflow-hidden">
            {video}
          </div>
        ) : (
          image && (
            <img
              className="w-full h-full object-cover rounded-xl"
              src={image}
              alt="Blog section visual"
            />
          )
        )}
      </div>

      <div className="flex-2/12 flex flex-col justify-center items-center md:items-start p-2">
        {typeof title === "string" ? (
          <h1 className="header-secondary-size">{title}</h1>
        ) : (
          title
        )}
        {typeof description === "string" ? (
          <p className="mt-4 content-primary-size text-[#5B5B5B]">
            {description}
          </p>
        ) : (
          description
        )}
        {button}
      </div>
    </div>
  );
};

export default Blog;
