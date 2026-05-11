import Blog from "../common/blog";
import Button from "../common/button";

const Craftsman: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mt-8 md:mt-16">
      <p className="header-primary-size font-bold text-center">
        Al-hantverkaren
      </p>

      <div className="mt-8">
        <Blog
          image="/images/consumer/craftsman/1.png"
          title={
            <div className="flex flex-col gap-2">
              <p className="font-bold header-secondary-size">Al-hantverkaren</p>
              <p className="content-primary-size">Få hjälp med ditt projekt</p>
            </div>
          }
          description={
            <div className="flex flex-col gap-4 content-primary-size text-[#5B5B5B]">
              <p>
                Välkommen till vår Al-hantverkare! Här kan du ställa tekniska
                frågor och få hjälp med allt från projektplanering till
                specifika tekniska krav.
              </p>
              <p>
                Observera att Al-verktyget är avsett som ett stöd och det är
                alltid viktigt att rådfråga en erfaren hantverksexpert för att
                säkerställa korrekt och tillförlitlig information. Detta verktyg
                är utformat för att ge dig vägledning och tips.
              </p>
              <p>
                För att få så mycket värde som möjligt från Al-hantverkaren är
                det bra att vara så detaljerad som möjligt i din fråga. Berätta
                om din specifika situation och ställ uppföljningsfrågor för att
                få så bra återkoppling som möjligt från vår Al.
              </p>
            </div>
          }
          button={<Button className="mt-6">Starta AI-Hantverkaren</Button>}
        />
      </div>
    </div>
  );
};

export default Craftsman;
