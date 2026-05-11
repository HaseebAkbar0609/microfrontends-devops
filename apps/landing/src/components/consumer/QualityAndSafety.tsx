import Blog from "../common/blog";
import Button from "../common/button";
import { RightArrow } from "../icons";
import Link from "next/link";

const QualityAndSafety: React.FC = () => {
  return (
    <div className="container mx-auto px-4 flex flex-col gap-8 md:gap-16 mt-10 md:mt-20">
      <p className="header-primary-size font-bold text-center">
        Kvalité & Trygghet
      </p>

      <Blog
        video={
          <div className="relative flex-2/5">
            <div style={{ position: "relative", aspectRatio: "16/9" }}>
              <iframe
                loading="lazy"
                title="Gumlet video player"
                src="https://play.gumlet.io/embed/68f901653b3b7b4917d6e740"
                style={{
                  border: "none",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className="rounded-xl"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              ></iframe>
            </div>
          </div>
        }
        title={
          <div className="flex flex-col gap-4">
            <p className="header-secondary-size font-bold">
              Kvalitetssäkrade tjänster
            </p>
            <p className="content-primary-size">Endast verifierade företag</p>
          </div>
        }
        description={
          <div className="mt-6 flex flex-col gap-4 content-primary-size">
            <p className="font-bold">
              Vi kvalitetssäkrar alla hantverkare som ger dig en offert.
            </p>
            <p className="text-[#5B5B5B]">
              Vi genomför omfattande bakgrundskontroller och verifierar
              kvalifikationer för alla hantverkare. De kontrolleras för att
              säkerställa att de har F-skattsedel och att de har
              företagsförsäkring.
            </p>
            <p className="text-[#5B5B5B]">
              Vårt system med kundrecensioner och betyg främjar transparens och
              ständiga förbättringar. Våra hantverkare är uppdaterade med de
              senaste standarderna och teknikerna. Alla offerter som skickas går
              till kunden via vårt affärssystem TimeFlow. Detta innebär att
              offerterna är av hög kvalitet och erbjuder rimliga priser. Vår
              kvalitetspolicy och övervakning hanterar kraftigt avvikande
              tendenser.
            </p>
          </div>
        }
      />

      <div className="flex justify-center">
        <Link href="/consumer/quality-assurance">
          <Button round="full" className="flex gap-2 items-center">
            <span className="text-[#0C0C0D]">Läs mer</span>
            <RightArrow />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default QualityAndSafety;
