import Link from "next/link";

const ProfessionalSupportContent: React.FC = () => {
  const supportOptions = [
    {
      title: "Chatt",
      icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758086053/7d2a15f695f975352992a5cbe75f0f22fd0bb659_dy67ir.png",
    },
    {
      title: "Mail",
      icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758086006/5e0caa753991a3ec69c7613d591d08e6b7316481_k8l4rq.png",
    },
    {
      title: "Phone",
      icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758086005/018cb4a24dcf57cb013c7bf63216c62ad9aef54a_rv45p1.png",
    },
    {
      title: "AI- Support",
      icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758086005/1914d2109425c5352f31d2433aae7b8c132789f9_lhmryy.png",
    },
    {
      title: "Webinar - On-demand",
      icon: "https://res.cloudinary.com/dtlt4zkth/image/upload/v1758086005/23a8c8e39261663658b35e83b19cc5354e7ffaf8_i0qpbg.png",
      href: "/professional/on_demand_webinar", // route to the page
    },
  ];

  return (
    <div className="container mx-auto py-10 md:py-20 px-4">
      <div className="bg-[#F8F8F8] rounded-lg text-center py-10 px-6 mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Proffsig support 24/7
        </h2>
        <p className="mt-4 text-gray-700 text-base md:text-lg">
          Kontakta vår support och få hjälp med TimeflowSystem
        </p>
        <p className="mt-2 text-gray-600 text-sm md:text-base">
          Vi är finns här för att hjälpa dig med dina frågor, välj någon av våra support funktioner
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12 text-center">
        {supportOptions.map((item, idx) => {
          const content = (
            <>
              <img
                src={item.icon}
                alt={item.title}
                className="w-20 h-20 object-contain"
              />
              <p className="mt-4 font-bold text-gray-900">{item.title}</p>
            </>
          );

          return (
            <div key={idx} className="flex flex-col items-center">
              {item.href ? (
                <Link href={item.href} className="flex flex-col items-center">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfessionalSupportContent;
