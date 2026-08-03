const ProfessionalDemoContent: React.FC = () => {
  return (
    <div className="container py-10 md:py-1 text-center">
      {/* Image */}
      {/* <div className="max-w-2xl mx-auto mb-8 my-20">
        <Image
          src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1758951835/medicalert-uk-9OnppW9mlCY-unsplash_ivu8re.jpg"
          alt="Demo meeting"
          width={800}
          height={450}
          className="rounded-lg"
        />
      </div> */}

      {/* Button */}
      <div className="mt-20 mb-20">
        <a
          href="https://calendly.com/timeflowsystem/har-kan-du-boka-30-min-mote-med-timeflowsystem"
          className="bg-black text-white px-20 py-4 rounded-xl text-lg font-medium hover:bg-[#e0712d] transition"
        >
          Boka demo
        </a>
      </div>

      {/* Text */}
      <h2 className="text-xl md:text-2xl font-medium mb-4">
        Boka ett demo möte och träffa vår representant
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Våra demo möte tar max 30 min och ger dig en unik kunskap om
        Timeflowsystem. Du kan ställa frågor och få svar på dina funderingar och
        behov.
      </p>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Efter att du registrerat dig får du en bekräftelse via e-post med en
        Teams-länk samt en inbjudan direkt till din Outlook-kalender – enkelt
        och smidigt.
      </p>

      <p className="text-lg font-semibold mb-8">
        Välj ett datum på länken nedan och säkra din plats redan idag <br></br> – vi ser
        fram emot att träffa dig online!
      </p>

      
    </div>
  );
};

export default ProfessionalDemoContent;
