import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { WebinarContextType, WebinarStateType } from "./webinar.types";
import { request } from "@/utils/request";

const WebinarContext = createContext<WebinarContextType | undefined>(undefined);

export const WebinarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [webinars, setWebinars] = useState<Record<string, WebinarStateType[]>>(
    {}
  );

  const fetchWebinars = useCallback(async () => {
    try {
      const response = await request.get("/webinars");

      if (response.success && response.data?.webinars) {
        const groupedWebinars = groupWebinarsByMonth(response.data.webinars);
        setWebinars(groupedWebinars);
      }
    } catch (error) {
      console.error("Failed to fetch webinars:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWebinars();
  }, [fetchWebinars]);

  const groupWebinarsByMonth = (webinars: WebinarStateType[]) => {
    const grouped: Record<string, WebinarStateType[]> = {};

    webinars.forEach((webinar) => {
      const monthKey = webinar.date.substring(0, 7);

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }

      grouped[monthKey].push(webinar);
    });

    const sortedGrouped: Record<string, WebinarStateType[]> = {};
    Object.keys(grouped)
      .sort()
      .forEach((key) => {
        sortedGrouped[key] = grouped[key].sort((a, b) => {
          if (a.date === b.date) {
            return a.time.localeCompare(b.time);
          }
          return a.date.localeCompare(b.date);
        });
      });

    return sortedGrouped;
  };

  return (
    <WebinarContext.Provider value={{ webinars, isLoading }}>
      {children}
    </WebinarContext.Provider>
  );
};

export const useWebinar = () => {
  const context = useContext(WebinarContext);
  if (!context) {
    throw new Error("useWebinar must be used within WebinarProvider");
  }
  return context;
};
