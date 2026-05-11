import ContactUs from "../common/contact-us";
import IconInput from "./subscribe-newsletter/email-box";

const ProfessionalContactUs: React.FC = () => {
  return (
    <div id="contact" className="mt-10 md:mt-20">
      <div className="container mx-auto p-4">
        <ContactUs />
      </div>

      <div className="py-10 md:py-15 lg:py-25 bg-primary-500 text-white text-center mt-10 md:mt-20 px-4">
        <div className="max-w-[786px] mx-auto">
          <h1 className="font-bold header-primary-size">
            Håll dig uppdaterad - prenumerera på våra nyhetsbrev.
          </h1>
          <p className="mt-6 content-primary-size">
            fullt av tips och värdefullt innehåll!
          </p>
          <IconInput className="mt-6" onSubmit={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalContactUs;
