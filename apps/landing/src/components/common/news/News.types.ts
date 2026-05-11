import { ReactNode } from "react";

export interface NewsType {
  title: string;
  description: ReactNode;
  date: string;
  image: string;
}

export interface NewsProps {
  resource: NewsType[];
}
