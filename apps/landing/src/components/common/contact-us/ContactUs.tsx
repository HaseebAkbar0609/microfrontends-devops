"use client";

import { Instagram, LinkedIn, YouTube } from "@/components/icons";
import Input from "@/components/common/input";
import Button from "../button";
import { useState } from "react";
import Textarea from "../textarea";
import { usePathname } from "next/navigation";

const ContactUs: React.FC = () => {
  const pathname = usePathname(); // ✅ get current route

  const [formData, setFormData] = useState({
    business: "",
    name: "",
    email: "",
    car: "",
    message: "",
  });

  const handleSubmit = () => {};

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="text-center">
        <h1 className="font-bold header-primary-size">Kontakta oss</h1>
        <p className="mt-6 content-primary-size text-[#5B5B5B]">
          Fyll i formuläret nedan, så återkommer vi snabbt.
        </p>
      </div>

      <div className="mt-8 w-full flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-1">
        <div className="w-full lg:basis-1/2 bg-[url('/images/professional/contact_us.png')] bg-cover bg-no-repeat bg-center p-5 lg:p-9">
          <h1 className="text-white font-bold text-3xl">Kundservice</h1>
          <div className="mt-10 flex flex-col gap-5 lg:gap-8">
            <div className="bg-white flex flex-col rounded-lg">
              <div className="flex px-5 py-3">
                <div className="flex-2/5 content-primary-size">Öppettider:</div>
                <div className="flex-3/5 text-[#5B5B5B] content-primary-size">
                  08:00 - 17:00
                </div>
              </div>
              <div className="flex px-5 py-3">
                <div className="flex-2/5 content-primary-size">Måndag</div>
                <div className="flex-3/5 text-[#5B5B5B] content-primary-size">
                  Fredag
                </div>
              </div>
            </div>

            <div className="bg-white flex flex-col rounded-lg">
              <div className="flex px-5 py-3">
                <div className="flex-2/5 content-primary-size">Telefon</div>
                <div className="flex-3/5 text-[#5B5B5B] content-primary-size">
                  070-426 10 92
                </div>
              </div>
              <div className="flex px-5 py-3">
                <div className="flex-2/5 content-primary-size">
                  Support nummer:
                </div>
                <div className="flex-3/5 text-[#5B5B5B] content-primary-size">
                  070-426 10 92
                </div>
              </div>
            </div>

            <div className="bg-white flex flex-col rounded-lg">
              <div className="flex px-5 py-3">
                <div className="flex-2/5 content-primary-size">E-post:</div>
                <div className="flex-3/5 text-[#5B5B5B] content-primary-size">
                  info@timeflowsystem.se
                </div>
              </div>
            </div>

            <div className="bg-white flex gap-5 px-5 py-3 rounded-lg">
              <Instagram />
              <YouTube />
              <LinkedIn />
            </div>
          </div>
        </div>

        <div className="w-full lg:basis-1/2 flex p-5 sm:p-9">
          <form onSubmit={handleSubmit} className="w-full">
            {/* ✅ Show Företag input ONLY on professional pages */}
            {pathname?.includes("/professional") && (
              <Input
                value={formData.business}
                onChange={(value) => updateFormData("business", value)}
                label="Företag"
                required={true}
                size="sm"
              />
            )}

            <Input
              className={`${pathname?.includes("/professional") ? "mt-6" : ""}`}
              value={formData.name}
              onChange={(value) => updateFormData("name", value)}
              label="Ditt namn"
              required={true}
              size="sm"
            />

            <Input
              className="mt-6"
              value={formData.email}
              onChange={(value) => updateFormData("email", value)}
              label="Din e-post"
              required={true}
              size="sm"
            />

            <Input
              className="mt-6"
              value={formData.car}
              onChange={(value) => updateFormData("car", value)}
              label="Mobil"
              required={true}
              size="sm"
            />

            <Textarea
              className="mt-6"
              value={formData.message}
              onChange={(value) => updateFormData("message", value)}
              label="Ditt meddelande (valfritt)"
              size="sm"
            />

            <Button type="submit" className="mt-6 font-bold text-sm">
              Skicka
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
