import HeroForm from "../hero-form";
import { HeroProps } from "./Hero.types";

const Hero: React.FC<HeroProps> = ({
  background,
  formTitle,
  formDescription,
  formButton,
  formButtonLink,   // ✅ new prop
}) => {
  return (
    <div
      className={`${background} bg-cover bg-no-repeat bg-center min-h-150 py-8 lg:py-16 px-4 lg:px-32 flex justify-start items-start`}
    >
      <div className="container mx-auto flex flex-col">
        <HeroForm
          title={formTitle}
          description={formDescription}
          button={formButton}
          buttonLink={formButtonLink}   // ✅ pass link to HeroForm
        />
      </div>
    </div>
  );
};

export default Hero;
