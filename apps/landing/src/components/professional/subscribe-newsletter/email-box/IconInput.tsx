import { FormEvent, useState } from "react";
import { IconInputProps } from "./IconInput.types";

const IconInput: React.FC<IconInputProps> = ({
  placeholder = "du@example.com",
  buttonText = "Skicka in",
  onSubmit,
  className = "",
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(email);
    }
    setEmail("");
  };

  return (
    <div className={`${className}`}>
      <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-orange-300 text-gray-700 placeholder-gray-500 min-w-[200px]"
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-3 py-2 md:px-6 md:py-3 rounded-r-lg font-medium hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default IconInput;
