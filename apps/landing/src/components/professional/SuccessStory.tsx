import Button from "../common/button";
import { Quote } from "../icons";

const SuccessStory: React.FC = () => {
  const Description = () => {
    return (
      <>
        <div id="success_story"></div>
        <p className="font-bold header-secondary-size mt-4">Kundcase</p>
        <p className="content-primary-size text-[#5B5B5B] mt-4">
          Lyssna på en kunds resa mot ökad lönsamhet. Ta del av en inspirerande
          videoberättelse om ett företag som valde att digitalisera sin
          verksamhet med hjälp av TimeFlow. Genom att arbeta smartare – inte mer
          – har de sparat massor av tid, fått bättre kontroll över sina projekt
          och sett tydliga förbättringar i lönsamheten.
        </p>
        <Button className="font-bold text-sm mt-4">Se hur de lyckades</Button>
        <div className="absolute bottom-10 right-10 w-14 h-14">
          <Quote />
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto mt-10 md:mt-20 pb-8 lg:pb-16 px-4">
      <h1 className="font-bold header-primary-size text-center">
        Lyssna på framgångshistorier från proffs
      </h1>

      {/* Desktop layout */}
      <div className="hidden relative md:flex flex-row mt-20">
        <div className="flex-3/5"></div>

        {/* Video embed (desktop) */}
        <div className="relative flex-2/5">
          <div style={{ position: "relative", aspectRatio: "16/9" }}>
            <iframe
              loading="lazy"
              title="Gumlet video player"
              src="https://play.gumlet.io/embed/68f901653b3b7b4917d6e732"
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

        {/* Description box */}
        <div className="absolute w-13/20 h-4/5 flex flex-col justify-between items-start bg-[#F2F2F2] p-4 lg:p-12 left-0 top-1/2 -translate-y-1/2 text-left gap-4">
          <Description />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden flex-col gap-4 mt-10">
        <div>
          <img
            className="w-full"
            src="/images/professional/success_story.png"
            alt="Success Story"
          />
        </div>
        <div>
          <Description />
        </div>
      </div>
    </div>
  );
};

export default SuccessStory;
