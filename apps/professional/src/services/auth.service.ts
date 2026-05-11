/**
 * function to get user language
 */
const getUserLanguage = (): string => {
  // First check if user has set a preference
  if (typeof window !== "undefined") {
    const savedLang = localStorage.getItem("userLanguage");
    if (savedLang) {
      return savedLang;
    }
  }

  // Fall back to browser language
  const userLang = navigator.language;
  if (userLang.includes("sv")) {
    return "sv";
  }
  return "en";
};

/**
 * function to set user language preference
 */
const setUserLanguage = (language: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userLanguage", language);
  }
};

const AuthService = {
  getUserLanguage,
  setUserLanguage,
};
export default AuthService;
