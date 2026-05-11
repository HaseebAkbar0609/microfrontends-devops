import { ReactNode } from "react";

export interface IntroBlogType {
  icon: ReactNode;
  title: string;
  description: ReactNode;
}

export interface IntroBlogProps {
  data: IntroBlogType[];
  title: string;
  description?: string;
}
