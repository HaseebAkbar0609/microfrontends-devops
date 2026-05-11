import Link from "next/link";
import {
  Facebook,
  Instagram,
  LinkedIn,
  Pinterest,
  TikTok,
  YouTube,
} from "../../icons";
import SearchInput from "../search-input";
import { FooterMenu } from "@/configs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface SubItem {
  label: string;
  children?: string[];
  path?: string;
}

const Footer: React.FC = () => {
  const router = useRouter();

  const [basePath, setBasePath] = useState("professional");

  useEffect(() => {
    if (router.pathname != "/") {
      const _path = router.pathname;
      if (_path.includes("professional")) {
        setBasePath("professional");
      } else {
        setBasePath("consumer");
      }
    }
  }, [router.pathname]);

  const contacts: Record<string, SubItem[]> = {
    Kontakt: [
      { label: "Telefon:", children: ["070-426 10 92"] },
      {
        label: "E-post:",
        children: ["info@timeflowsystem.se"],
      },
      {
        label: "Licensgivare:",
        children: ["TimeFlowSystem OU", "VAT nr: EE102870455"],
      },
      {
        label: "Affiliated bolag:",
        children: ["TimeFlowSystem Group AB", "Org nr: 559063-0777"],
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between py-4 items-center sm:items-end border-b-2 border-[#C5C5C5] gap-4">
        <div>
          <Link href={"/"}>
            <img src="/images/logo.png" alt="Logo" width={180} />
          </Link>
        </div>
        <div className="w-full max-w-[300px] flex justify-around items-center">
  <a href="https://www.facebook.com/people/Timeflowsystem-OU/100048386178666/" target="_blank" rel="noopener noreferrer">
    <Facebook color="black" />
  </a>
  <a href="https://www.instagram.com/timeflowsystem/" target="_blank" rel="noopener noreferrer">
    <Instagram color="black" />
  </a>
  <a href="https://www.linkedin.com/company/timeflowsystem/" target="_blank" rel="noopener noreferrer">
    <LinkedIn color="black" />
  </a>
  <a href="https://www.youtube.com/@timflowsystem" target="_blank" rel="noopener noreferrer">
    <YouTube color="black" />
  </a>
  {/* TikTok is “N/a”, so you may skip linking or leave placeholder */}
  <a href="https://se.pinterest.com/0azrjkgfey53mfjs3fa4lfvpoodz84/?invite_code=9e653ff528804d199a26472db277a7e1&sender=904027462609186876" target="_blank" rel="noopener noreferrer">
    <Pinterest color="black" />
  </a>
</div>

      </div>

      <div className="mt-10 grid md:grid-cols-3 lg:grid-cols-6 gap-2 text-center md:text-left">
        {Object.keys(contacts).map((item, key) => (
          <div className="fex flex-col gap-2" key={key}>
            <div className="footer-title-size font-medium mb-7">{item}</div>
            {contacts[item].map((sub, subKey) => (
              <div key={subKey} className="flex flex-col gap-1 my-3">
                <p
                  className={`content-primary-size ${
                    sub.children ? "font-medium" : "text-[#5B5B5B]"
                  }`}
                >
                  {sub.label}
                </p>
                {sub.children &&
                  sub.children.map((child, childKey) => (
                    <p
                      className="content-secondary-size text-[#5B5B5B]"
                      key={childKey}
                    >
                      {child}
                    </p>
                  ))}
              </div>
            ))}
          </div>
        ))}
        {Object.keys(FooterMenu[basePath]).map((item, key) => (
          <div className="fex flex-col gap-2" key={key}>
            <div className="footer-title-size font-medium mb-7">{item}</div>
            {FooterMenu[basePath][item].map((sub, subKey) => (
              <div key={subKey} className="flex flex-col gap-1 my-3">
                <Link
                  href={sub.path ? `/${basePath}/${sub.path}` : `/${basePath}/#`}
                >
                  <p
                    className={`content-secondary-size text-[#5B5B5B] hover:text-primary-500 transition-colors duration-200`}
                  >
                    {sub.label}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        ))}
        <div className="fex flex-col gap-2">
          <div className="fex flex-col gap-2">
            <div className="footer-title-size font-medium mb-7">
              Sök innehåll
            </div>
            <div className="flex flex-col gap-1 my-3">
              <SearchInput />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
