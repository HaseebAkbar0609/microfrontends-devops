import React from "react";

const NewsroomContent: React.FC = () => {
  return (
    <section className="container mx-auto py-16 px-6">
      <div className="bg-gray-50 rounded-lg p-10 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          En enkel lösning för entreprenörer i hantverksbranschen
        </h2>
        <p className="mt-4 text-gray-700">
          Det enkla sättet att hantera dina projekt, kunder och din verksamhet –
          allt på ett och samma ställe.
        </p>
        <p className="mt-6 text-gray-800 font-medium">
          Smarta verktyg för att göra kunderna nöjda och förenkla arbetsflödena
        </p>
      </div>
    </section>
  );
};

export default NewsroomContent;
