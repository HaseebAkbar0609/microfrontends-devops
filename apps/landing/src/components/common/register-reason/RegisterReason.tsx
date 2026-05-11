import { Check } from "@/components/icons";
import { RegisterReasonProps } from "./RegisterReason.types";

const RegisterReason: React.FC<RegisterReasonProps> = ({ title, resource }) => {
  return (
    <>
      <div className="">
        <p className="font-bold header-primary-size text-center">{title}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4 md:mt-8">
        {resource.map((item, key) => (
          <div key={key} className="flex gap-2">
            <div className="content-primary-size flex items-start gap-2">
              <span className="w-6 h-6 shrink-0">
                <Check />
              </span>
              <span>{item}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RegisterReason;
