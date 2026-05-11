import { ReactNode } from "react";
import Link from "next/link";
import {
  B2B,
  Balance,
  Building,
  Calculator,
  Calendar,
  Clipboard,
  Cloud,
  Collection,
  Compass,
  Cup,
  DollarSign,
  Folder,
  People,
  Receipt,
  SearchCurrency,
  Setting,
  ShoppingCart,
  Sun,
  Temperature,
  ThumbUp,
} from "@/components/icons";

// Play Button Component
const PlayButton = () => (
  <div className="w-10 h-10 flex items-center justify-center bg-[#FF914D] rounded-full flex-shrink-0">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
);

interface ModuleItem {
  label: string;
  icon: ReactNode;
  path?: string;
}

const modules: ModuleItem[] = [
  // Col 1 (3 items)
  { label: "OFFERT", icon: <ThumbUp />, path: "/professional/offer" },
  { label: "B2B", icon: <B2B />, path: "/professional/B2b_page" },
  { label: "KALKYL", icon: <Calculator />, path: "/professional/Calculation" },

  // Col 2 (6 items)
  { label: "PROJEKTERING", icon: <Compass />, path: "/professional/Project_Design" },
  { label: "KMA", icon: <Cup />, path: "/professional/KMA" },
  { label: "ORDER", icon: <Clipboard />, path: "/professional/Order" },
  { label: "PROJEKT", icon: <Folder />, path: "/professional/Project" },
  { label: "INKÖP", icon: <ShoppingCart />, path: "/professional/Purchase" },
  { label: "MATERAIL - LAGER", icon: <Setting />, path: "/professional/Machine" },
  { label: "FORDON", icon: <Setting />, path: "/professional/Machine" },
  { label: "MASKIN", icon: <Setting />, path: "/professional/Machine" },
  { label: "ÅTKOMST", icon: <Setting />, path: "/professional/Machine" },

  // Col 3 (6 items)
  { label: "EKONOMI", icon: <DollarSign />, path: "/professional/Economy" },
  { label: "FAKTURA", icon: <Receipt />, path: "/professional/Invoice" },
  { label: "PROGNOS", icon: <Temperature />, path: "/professional/Forecast" },
  { label: "PERSONAL", icon: <People />, path: "/professional/Personal" },
  { label: "INKASSO", icon: <Collection />, path: "/professional/Collection" },
  { label: "JURIDIK", icon: <Balance />, path: "/professional/Legal" },

  // Col 4 (5 items)
  { label: "AVTAL", icon: <Calendar />, path: "/professional/Agreement" },
  {
    label: "MALLAR",
    icon: (
      <div className="w-7 h-7">
        <Building />
      </div>
    ),
    path: "/professional/Goods",
  },
  { label: "MARKNAD-SÄLJ", icon: <SearchCurrency />, path: "/professional/Market" },
  { label: "DATA - IT", icon: <Cloud />, path: "/professional/Data" },
  { label: "LEDNINGSSTÖD", icon: <Sun />, path: "/professional/Management" },
];

const Content: React.FC = () => {
  // split modules into the exact column groups you specified
  const columns = [
    modules.slice(0, 3), // col 1: 3 items
    modules.slice(3, 9), // col 2: 6 items
    modules.slice(9, 15), // col 3: 6 items
    modules.slice(15, 20), // col 4: 5 items
  ];

  return (
    <div className="bg-[white] py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-[#F2F2F2] py-26 rounded-lg shadow-sm text-center ">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            On - demand webinar hur våra moduler och appen Timeflow Work - fungerar
          </h2>
          <p className="mt-3 text-gray-600">
            Titta på en 15 minuter on-demand webinar hur våra moduler eller appen TimeFlow Work - fungerar.
          </p>
          <p className="mt-8">
            Ni kan starta webinaret när ni själva vill, få inblick och presentation över våra <br />
            funktioner i modulerna eller appen.<br />
            Klicka på vald modul eller Timeflow work appen och starta webinaret<br />
            enklare än så blir det inte
          </p>
        </div>

        {/* Modules Grid */}
        <div className="bg-[#FF914D] mt-10 p-8 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Frame</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex flex-col gap-4">
                {col.map((item, idx) => {
                  const card = (
                    <div
                      key={idx}
                      className="w-full px-6 py-3 bg-white rounded-lg flex items-center justify-between hover:border hover:border-[#FF914D] transition cursor-pointer shadow-sm"
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 flex items-center justify-center text-gray-800">
                          {item.icon}
                        </div>
                        <p className="text-base font-medium text-gray-800">{item.label}</p>
                      </div>
                      <PlayButton />
                    </div>
                  );

                  return item.path ? (
                    <Link key={idx} href={item.path}>
                      {card}
                    </Link>
                  ) : (
                    card
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-10 text-center">
          <button className="px-8 py-4 bg-[#FF914D] text-white rounded-lg font-semibold hover:bg-[#e57d35] transition flex items-center gap-3 mx-auto shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Starta webinar Timeflow Work Appen
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;
