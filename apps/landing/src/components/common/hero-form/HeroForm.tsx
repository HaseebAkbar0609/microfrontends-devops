"use client";

import { Mail, SmartPhone } from "@/components/icons";
import Input from "@/components/common/input";
import { useState } from "react";
import Button from "../button";
import { HeroFormProps } from "./HeroForm.types";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeroForm: React.FC<HeroFormProps> = ({
  title,
  description,
  button,
  buttonLink,
}) => {
  const [formData, setFormData] = useState({ email: "", mobilePhone: "" });
  const pathname = usePathname() || "";

  // Check which section user is in
  const isProfessional = pathname.includes("/professional");
  const termsHref = isProfessional ? "/professional/terms" : "/consumer/terms";


  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonLink) {
      try {
        const url = new URL(buttonLink);
        if (formData.email) url.searchParams.set("email", formData.email);
        if (formData.mobilePhone)
          url.searchParams.set("phone", formData.mobilePhone);
        window.location.href = url.toString();
      } catch (error) {
        console.error("Invalid URL:", buttonLink);
        // Fallback or just go to the link if it's relative (though likely it's absolute here)
        window.location.href = buttonLink;
      }
    }
  };

  return (
    <div className="max-w-[480px] p-6 bg-white rounded-2xl shadow-sm">
      <h1 className="font-bold header-secondary-size">{title}</h1>
      <p className="text-base leading-6 mt-6 text-[#5B5B5B]">{description}</p>

      <form onSubmit={handleRedirect}>
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
          placeholder="Mobiltelefon"
          required={true}
          icon={<SmartPhone />}
        />

        <Button type="submit" className="w-full mt-3">
          {button}
        </Button>
      </form>

      <p className="mt-6 text-[#5B5B5B]">
        Genom att registrera mig logga in eller forsätta godkänner jag
        Timeflowsystem{" "}
        <Link href={termsHref}>
          <span className="text-sm text-[#FF6600] cursor-pointer hover:underline">
            användare villkor
          </span>
        </Link>
      </p>
    </div>
  );
};

export default HeroForm;
