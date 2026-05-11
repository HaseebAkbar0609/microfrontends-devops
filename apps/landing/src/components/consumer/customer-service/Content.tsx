const CustomerServiceContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Intro text */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Kontakta oss</h2>
        <p className="text-gray-600">
          Fyll i formuläret nedan, så återkommer vi snabbt.
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left: Contact info */}
        <div className="relative bg-black shadow-md rounded-2xl p-6 flex flex-col gap-6">
          <img
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382309/9530814999d167e0e4297c0cecb576e8bad6a47a_jxg303.jpg"
            alt="Kundservice"
            className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-90"
          />

          <div className="relative flex flex-col gap-4 z-10">
            <h3 className="text-xl text-white font-semibold">Kundservice</h3>

            <div className="bg-white shadow rounded-xl p-4">
              <p className="font-medium">Öppettider:</p>
              <p>08:00 - 17:00</p>
              <p>Måndag – Fredag</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <p className="font-medium">Telefon</p>
              <p>070-426 10 92</p>
              <p className="font-medium mt-2">Support nummer</p>
              <p>070-426 10 92</p>
            </div>

            <div className="bg-white shadow rounded-xl p-4">
              <p className="font-medium">E-post</p>
              <p>info@timeflowsystem.se</p>
            </div>

            <div className="flex gap-3 mt-2">
              <a href="#" className="text-orange-500 text-xl">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-orange-500 text-xl">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-orange-500 text-xl">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <form className="flex flex-col gap-6">
            <div>
              <input
                type="text"
                placeholder="Ditt namn"
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Din e-post"
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Mobil"
                className="w-full border rounded-xl p-3"
              />
            </div>
            <div>
              <textarea
                placeholder="Ditt meddelande (valfritt)"
                className="w-full border rounded-xl p-3 h-32"
              />
            </div>
            <button
              type="submit"
              className="bg-[#FF7A00] hover:bg-[#e76c00] text-white font-medium py-3 px-6 rounded-xl transition"
            >
              Skicka
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceContent;
