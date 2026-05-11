import Button from "@/components/common/button";

const ProfessionalWebinarDiscover: React.FC = () => {
  return (
    <div className="bg-[#FF9051]">
      <div className="container mx-auto flex flex-col items-center max-w-7xl px-4">
        <Button
          round="full"
          className="w-max border border-white text-white mt-10 md:mt-20"
        >
          Gratis webbinarium
        </Button>
        <p className="font-bold text-2xl md:text-4xl text-center mt-8 text-white leading-snug">
          Boka Höstens Webinarier – Upptäck kraften i projektverktyget
          <br />
          TimeFlowSystem!
        </p>
        <img
          className="w-full h-auto mt-12 md:mt-16"
          src={"/images/professional/webinar/discover/1.png"}
          alt="Webinar hero"
        />
      </div>
    </div>
  );
};

export default ProfessionalWebinarDiscover;
