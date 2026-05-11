"use client";

import { useState } from "react";
import { Mail, SmartPhone } from "../icons";
import Input from "../common/input";
import Button from "../common/button";
import Textarea from "../common/textarea";
import Checkbox from "../common/checkbox";
import { usePathname } from "next/navigation";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobilePhone: "",
    message: "",
    checked: false,
  });

  const [error, setError] = useState("");

  const pathname = usePathname() || "";
  const isProfessional = pathname.includes("/professional");

  const registerLink = isProfessional
    ? "https://timeflowsystem.com/register/member"
    : "https://timeflowsystem.com/register/customer";

  const handleFormDataChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // clear error when typing
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, mobilePhone, checked } = formData;

    // Basic validation
    if (!name || !email || !mobilePhone) {
      setError("Vänligen fyll i alla obligatoriska fält.");
      return;
    }

    if (!checked) {
      setError("Du måste godkänna användarvillkoren.");
      return;
    }

    // Redirect after validation (same tab)
    window.location.href = registerLink;
  };

  return (
    <div className="w-full relative bg-[url('/images/consumer/register/1.png')] bg-no-repeat bg-center bg-cover flex justify-center items-center mt-8 md:mt-16 px-4 py-5 md:py-12 lg:py-20">
      <div className="absolute w-full h-full opacity-80 bg-primary-500"></div>
      <div className="z-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-[700px] px-4 md:px-8 py-6 md:py-12 bg-white rounded-2xl shadow-sm"
        >
          <h1 className="font-bold header-primary-size text-center">
            Registrera ditt projekt - det är gratis
          </h1>

          <Input
            className="mt-8"
            value={formData.name}
            onChange={(value) => handleFormDataChange("name", value)}
            type="text"
            placeholder="Namn"
            required={true}
            icon={<Mail />}
          />

          <Input
            className="mt-8"
            value={formData.email}
            onChange={(value) => handleFormDataChange("email", value)}
            type="email"
            placeholder="Mailadress"
            required={true}
            icon={<Mail />}
          />

          <Input
            className="mt-4"
            value={formData.mobilePhone}
            onChange={(value) => handleFormDataChange("mobilePhone", value)}
            type="number"
            placeholder="Telefonnummer"
            required={true}
            icon={<SmartPhone />}
          />

          <Textarea
            className="mt-4"
            value={formData.message}
            onChange={(value) => handleFormDataChange("message", value)}
            placeholder="Beskriv ditt projekt..."
          />

          <div className="grid grid-cols-2 gap-4 mt-3">
            <Checkbox
              id="check"
              checked={formData.checked}
              onChange={(value) => handleFormDataChange("checked", value)}
              label="Jag godkänner TimeFlows användarvillkor"
            />
            <Button type="submit" className="w-full">
              Skicka & skapa konto
            </Button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
