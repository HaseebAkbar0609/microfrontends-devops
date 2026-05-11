import Image from "next/image";
import Button from "../common/button";
import Blog from "../common/blog";

const TimeFlowWork: React.FC = () => {
  const data = [
    {
      image: "/images/professional/timeflowwork_2.png",
      title: "Drive - körjournal -spårning",
      content:
        "Med vårt smarta verktyg - Drive kan du hantera din bil-park med körjournaler, spårning och underhålls hantering- enklare blir det inte",
    },
    {
      image: "/images/professional/timeflowwork_3.png",
      title: "Rutt-plan",
      content:
        "Med vår smarta funktion – Rutt-plan i TimeFlow System kan du enkelt skapa effektiva ruttplaneringar för dina projekt. Spara tid, minska körsträckor och få full kontroll över dina uppdrag",
    },
    {
      image: "/images/professional/timeflowwork_4.png",
      title: "Metric - mätning",
      content:
        "Med vår smarta appfunktion – Metric – kan du enkelt mäta ytor och avstånd direkt i mobilen. Använd AI-teknik för snabba, precisa mätningar utan måttband. Perfekt för offerter och projektering på plats.",
    },
    {
      image: "/images/professional/timeflowwork_5.png",
      title: "Product - Finder",
      content:
        "Med vår smarta appfunktion – Product Finder – kan du fota en produkt och direkt få fram tillverkare, pris och detaljerad information. Spara tid och hitta rätt material på plats – snabbt och enkelt.",
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col py-12 container mx-auto px-4 mt-10 md:mt-20">
        <div className="text-center">
          <h1 className="font-bold header-primary-size">TimeFlow Work</h1>
          <p className="mt-4 content-primary-size text-[#5B5B5B]">
            Kontoret i fickan – hantera allt, var du än är.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 mt-10">
          <div className="flex-2/5">
            <div className="flex-1 text-center">
              <img
                className="mx-auto"
                src="/images/professional/timeflowwork_1.png"
              />
            </div>
            <div className="mt-12 flex gap-2 justify-center">
              <Image
                src="/images/app_store_logo.png"
                alt="app store logo"
                width={140}
                height={140}
              />
              <Image
                src="/images/google_store_logo.png"
                alt="google store logo"
                width={140}
                height={140}
              />
            </div>
          </div>
          <div className="flex-3/5 flex flex-col justify-center items-center md:items-start">
            <h1 className="font-bold timeflow-subtitle-size">
              Sköt företaget smidigt, oavsett var du befinner dig
            </h1>
            <p className="mt-6 content-primary-size md:text-4xl text-[#5B5B5B]">
              Här ser du vad som gör TimeFlow unikt.
            </p>

            <h2 className="mt-5 header-secondary-size ">
              TimeFlow Work - ha hela företaget i fickan
            </h2>
            <p className="mt-4 text-[#5B5B5B]">
              TimeFlow är tillgängligt på alla enheter oavsett om du jobbar från
              datorn på kontoret, mobilen ute på fältet eller surfplattan på
              språng. Du har alltid enkel och snabb åtkomst till dina projekt,
              offerter och kunduppgifter. Med TimeFlow har du hela verksamheten
              i fickan och full kontroll var du än befinner dig.
            </p>
             <div className="mt-8 text-center">
                <a href="https://timeflowsystem.com/register/member">
                  <Button>Skapa konto</Button>
                </a>
              </div>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-[#F5F5F5] px-4">
        <div className="flex flex-col gap-6 container mx-auto">
          {data.map((item, key) => (
            <Blog
              key={key}
              direction={key % 2 === 0 ? "right" : "left"}
              image={item.image}
              title={item.title}
              description={item.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeFlowWork;
