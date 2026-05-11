import { useState } from "react";
import Input from "../common/input";
import Button from "../common/button";
import Textarea from "../common/textarea";

const ConsumerLandingContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = () => {};

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailSubmit = (data: string) => {};

  return (
    <div className="container mx-auto px-4 mt-10 md:mt-20" id="contact-us">
      <div className="text-center">
        <h1 className="font-bold header-primary-size">Kontakta oss</h1>
        <p className="mt-6 content-primary-size text-[#5B5B5B]">
          Fyll i formuläret nedan, så återkommer vi snabbt.
        </p>
      </div>

      <div className="mt-18 grid lg:grid-cols-2 gap-8">
        <div className="min-h-[600px] bg-[url('/images/consumer-landing/contact-us/1.png')] bg-cover bg-no-repeat bg-center py-4 px-2 lg:py-12 lg:px-9"></div>

        <div className="flex pt-12 pb-24 px-9">
          <form onSubmit={handleSubmit} className="w-full">
            <Input
              className="mt-6"
              value={formData.name}
              onChange={(value) => updateFormData("name", value)}
              label="Namn"
              placeholder="Fyll i ditt Namn"
              required={true}
              size="sm"
            />

            <Input
              className="mt-6"
              value={formData.email}
              onChange={(value) => updateFormData("email", value)}
              label="Din e-post"
              placeholder="Fyll i din E-post"
              required={true}
              size="sm"
            />

            <Input
              className="mt-6"
              value={formData.subject}
              onChange={(value) => updateFormData("subject", value)}
              label="Ämne"
              placeholder="Ange ämne"
              required={true}
              size="sm"
            />

            <Textarea
              className="mt-4"
              value={formData.message}
              onChange={(value) => updateFormData("message", value)}
              label="Ditt meddelande"
              placeholder="Skriv ditt meddelande"
              size="sm"
            />

            <Button type="submit" className="mt-6 font-bold text-sm">
              Skicka
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsumerLandingContactUs;
