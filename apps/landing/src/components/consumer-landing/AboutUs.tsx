import Blog from "../common/blog";
import { ConsumerLandingPinRibbon } from "../icons";

const ConsumerLandingAboutUs: React.FC = () => {
  return (
    <div className="container mx-auto mt-10 md:mt-20 px-4">
      <div className="relative border border-primary-500 rounded-2xl">
        <Blog
          title={
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center justify-center md:justify-start">
                <p className="header-primary-size font-bold">Om oss</p>
                <div className="">
                  <span className="text-xs bg-primary-500 text-white rounded-r-2xl py-2 px-4 ">
                    KONSUMENT
                  </span>
                </div>
              </div>
              {/* <p className="header-secondary-size text-[#5B5B5B]">
                Få fler kunder – direkt i ditt projektverktyg
              </p> */}
            </div>
          }
          description={
            <div className="flex flex-col gap-4 content-primary-size mt-10">
              <p className="text-[#5B5B5B]">
                Vi hjälper dig som konsument att få en smidigare och mer
                kostnadseffektiv lösning för dina renoveringar. Registrera ditt
                konto, sen är det bara att lägga ut ditt uppdrag. Våra
                professionella hantverkare och företag hör av sig, du väljer
                leverantör och får jobbet gjort!
              </p>
              <p className="text-[#5B5B5B]">
                Genom TimeFlow får du inte bara kostnadsfria offerter, du får
                även en app som du hantera hela ditt projekt i, samt rabatter
                och löpande erbjudanden från våra partners. Allt detta endast
                för dig som användare av TimeFlow. Är du redo att börja anlita
                hantverkare på ett smidigare och roligare sätt? Skapa konto nu!
              </p>
            </div>
          }
          image="/images/consumer-landing/about-us/1.png"
        />
      </div>
    </div>
  );
};

export default ConsumerLandingAboutUs;
