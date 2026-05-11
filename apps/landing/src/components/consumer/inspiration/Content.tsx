import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Link from "next/link";

const categories = [
  { title: "Kök", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382908/eda8bc0ebc0f0ffc2a71a285a5b0e82567c2687a_zwu6tu.jpg" },
  { title: "Badrum", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382906/550e45ec8d051d2932ef80fc6f99b1ebf3ad2a77_wvw3ml.jpg" },
  { title: "Golv", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382905/4cfe1f6f56b66e0c1323338ffd0aa5ab25662e07_akzucv.jpg" },
  { title: "Lampor", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382904/6307c775c36cd2eb9d7188a54a0a122400ac72b4_f31zli.jpg" },
  { title: "Spis", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382904/bfe1a0e5f630eeee7bf54d09bdbde19e0dce1801_yh95fg.jpg" },
  { title: "Inredning", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382899/59299796f3c391debfe3f070e9b7e3c91624596b_atb0hy.jpg" },
  { title: "Orangeri", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382900/85b2e95867494582ae325212d02adbc39c203d7a_dop740.jpg" },
  { title: "Villa", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382899/e645e0ad100c05d48a084f1d5e5d2351958ff308_teblgm.jpg" },
  { title: "Trädgård", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382898/f9c93bda229e1d8bee1d2426bb5411932d38410c_rtw6rk.jpg" },
  { title: "Tak", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382898/a7378d24486c95c9ddc45969e7b1739ae7f842d9_p70mdf.jpg" },
  { title: "Pool", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382898/c8bcec16b3b8c392d605fd95f66c5e64d50227d6_nuydrn.jpg" },
  { title: "Altan", img: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382899/204d39ef73d17a01b729f07a714896f3858f49e0_tsrbey.png" },
];

const InspirationContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      {/* Intro Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planera drömhemmet med trygghet – låt dig inspireras
          </h2>
          <p className="text-gray-700 mb-6">
            Visar vägen från idé till verklighet – och hjälper företag att
            förverkliga dina projekt på ett tryggt och inspirerande sätt.
          </p>
          <p className="text-gray-600 mb-6">
            Att renovera, bygga om eller förbättra sitt hem är både spännande
            och utmanande. Oavsett om du drömmer om ett nytt kök, en uteplats,
            dränering, målning eller tillbyggnad vill du ha tydlighet,
            trygghet och kontroll genom hela resan.
          </p>
          <p className="text-gray-600 mb-6">
            På den här sidan kan du hämta idéer, se exempel på riktiga projekt,
            och få hjälp att ställa rätt frågor innan du anlitar en entreprenör.
          </p>
          <p className="text-gray-600 mb-6">
            Med TimeFlow System kan du känna dig trygg – från första tanke till
            färdigt resultat. Välj företag som jobbar strukturerat,
            kommunicerar tydligt och håller vad de lovar. Det ger både ett
            bättre hem och en bättre upplevelse längs vägen.
          </p>
          <p className="text-gray-600 mb-6">
            Bläddra bland bilder, smarta lösningar och tips – och börja planera
            din nästa förändring hemma med full koll från start.
          </p>
          <Link href="https://timeflowsystem.com/register/customer" target="_self">
            <button className="bg-[#FF7A00] hover:bg-[#e76c00] text-white font-medium py-3 px-6 rounded-xl transition">
              Skapa Konto
            </button>
          </Link>
        </div>

        <div>
          <img
            src="https://res.cloudinary.com/dtlt4zkth/image/upload/v1759382909/c7f4e767f6049ec0cc41578f816633cefca08262_f3bork.png"
            alt="Inspiration family"
            className="rounded-xl shadow-md h-100"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <div key={index}>
            <h3 className="text-xl font-bold mb-3">{cat.title}</h3>
            <Swiper
              modules={[Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="rounded-xl overflow-hidden shadow-md"
            >
              {[1, 2, 3, 4].map((slide) => (
                <SwiperSlide key={slide}>
                  <img
                    src={cat.img}
                    alt={`${cat.title} inspiration`}
                    className="w-full h-64 object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationContent;
