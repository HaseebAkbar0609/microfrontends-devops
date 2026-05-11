import Link from "next/link";

const ProfessionalWebinarOnlineMeeting: React.FC = () => {
  const months = [
    {
      name: "AUGUSTI",
      dates: ["13/8", "20/8", "27/8"],
    },
    {
      name: "SEPTEMBER",
      dates: ["3/9", "10/9", "17/9", "24/9"],
    },
    {
      name: "OKTOBER",
      dates: ["1/10", "8/10", "15/10", "22/10", "29/10"],
    },
    {
      name: "NOVEMBER",
      dates: ["5/11", "12/11", "19/11", "20/11", "27/11"],
    },
    {
      name: "DECEMBER",
      dates: ["3/12", "10/12", "17/12"],
    },
  ];

  return (
    <div className="container mx-auto mt-16 md:mt-24 flex flex-col items-center max-w-7xl px-4">
      {/* Title */}
      <p className="text-2xl md:text-3xl font-bold text-center text-gray-900">
        Välj ett datum och säkra din plats redan idag - vi ser fram emot att
        träffa dig online!
      </p>

      {/* Months Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 w-full">
        {months.map((month, idx) => (
          <div key={idx} className="flex flex-col items-center gap-4">
            {/* Month header */}
            <div className="w-full py-3 bg-[#FF914D] text-white font-semibold rounded-md uppercase text-center">
              {month.name}
            </div>

            {/* Dates */}
            <div className="flex flex-col gap-3 w-full">
              {month.dates.map((date, dIdx) => (
                <Link key={dIdx} href="#" target="_blank">
                  <div className="border border-[#FF914D] text-[#FF914D] hover:bg-[#FF914D] hover:text-white transition-colors duration-200 cursor-pointer rounded-md py-2 text-sm font-medium text-center">
                    {date} BOKA HÄR
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalWebinarOnlineMeeting;
