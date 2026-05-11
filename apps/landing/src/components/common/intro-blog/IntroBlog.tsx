import { IntroBlogProps } from "./IntroBlog.types";

const IntroBlog: React.FC<IntroBlogProps> = ({ data, title, description }) => {
  return (
    <>
      <div className="flex flex-col gap-8 items-center">
        <h1 className="font-bold header-primary-size">{title}</h1>
        {description && (
          <p className="content-primary-size text-[#5B5B5B]">{description}</p>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 md:mt-8">
        {data.map((item, key) => (
          <div
            key={key}
            className="group flex flex-col gap-8 p-8 rounded-2xl bg-[#F7F7F7] hover:bg-[#FF914D] cursor-pointer"
          >
            <h1 className="font-medium footer-title-size">{item.title}</h1>
            <div className="flex-1 flex gap-5">
              <div>{item.icon}</div>
              <div className="flex flex-col text-left">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default IntroBlog;
