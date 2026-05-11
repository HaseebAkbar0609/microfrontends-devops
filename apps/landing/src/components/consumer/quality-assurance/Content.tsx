const QualityAssuranceContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      {/* Title */}
      <div className="text-center mb-12">
        <p className="text-sm text-gray-500 mb-2">Timeflowsystem – kvalitetssäkring</p>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          En enkel lösning för entreprenörer i hantverksbranschen
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Så här säkerställs att du som kund får tag på seriösa, skickliga och konkurrenskraftiga 
          hantverksföretag via TimeFlow System.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Box 1 - Registrering */}
        <div className="bg-[#F2F2F2] shadow-md rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Replace src="" with your icon URL */}
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_xjbkbx.png" alt="Registrering ikon" className="w-12 h-12 p-2 bg-[#FFF6F2] rounded-lg" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Registrering</h3>
              <p className="text-gray-600">
                Alla hantverkare i TimeFlow System har företagsbehörighet och är registrerade för moms, skatt och som arbetsgivare. 
                Det skapar trygghet för både kunder och samarbetspartners.
              </p>
            </div>
          </div>
        </div>

        {/* Box 2 - Kreditvärdighet */}
        <div className="bg-[#F2F2F2] shadow-md rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Replace src="" with your icon URL */}
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_1_wozr47.png" alt="Kreditvärdighet ikon" className="w-12 h-12 p-2 bg-[#FFF6F2] rounded-lg" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Kreditvärdighet</h3>
              <p className="text-gray-600">
                Tack vare uppkoppling mot tredjepartsleverantör får du – genom plattformen – ta del av bolagets ekonomiska status i realtid.
              </p>
            </div>
          </div>
        </div>

        {/* Box 3 - Omdömen & Referenser */}
        <div className="bg-[#F2F2F2] shadow-md rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Replace src="" with your icon URL */}
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_2_q54pcg.png" alt="Omdömen ikon" className="w-12 h-12 p-2 bg-[#FFF6F2] rounded-lg" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Omdömen & Referenser</h3>
              <p className="text-gray-600">
                Omdömen i systemet går inte att påverka och varje företag kan enkelt addera tidigare projekt och intyg.
              </p>
            </div>
          </div>
        </div>

        {/* Box 4 - Seriösa Offerter */}
        <div className="bg-[#F2F2F2] shadow-md rounded-2xl p-6">
          <div className="flex items-start gap-4">
            {/* Replace src="" with your icon URL */}
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_3_zvofye.png" alt="Offert ikon" className="w-12 h-12 p-2 bg-[#FFF6F2] rounded-lg" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Seriösa Offerter</h3>
              <p className="text-gray-600">
                Offerter skickas via plattformen – det motverkar fusk och skapar transparens. Att sätta rätt pris blir enklare för hantverkaren.
              </p>
            </div>
          </div>
        </div>

        {/* Box 5 - Högre Kvalité (spans two columns) */}
        <div className="bg-[#F2F2F2] shadow-md rounded-2xl p-6 md:col-span-2">
          <div className="flex items-start gap-4">
            {/* Replace src="" with your icon URL */}
            <img src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759289071/Icons_Kvalitetss%C3%A4kring_4_e03nax.png" alt="Kvalité ikon" className="w-12 h-12 p-2 bg-[#FFF6F2] rounded-lg" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Högre Kvalité</h3>
              <p className="text-gray-600">
                Hantverkare i TimeFlow System arbetar med ett modernt projektverktyg som säkerställer hög kvalitet, hållbarhet och god arbetsmiljö – utan misstag. 
                Genom integration med tredjepartsleverantör får du dessutom insyn i företagets ekonomiska status i realtid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityAssuranceContent;
