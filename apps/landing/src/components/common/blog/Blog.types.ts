import { ReactNode } from "react";

export interface BlogProps {
  image?: string;
  title: ReactNode;
  direction?: "right" | "left";
  description?: ReactNode;
  button?: ReactNode;
  children?: React.ReactNode;
  video?: React.ReactNode; // ✅ NEW
}
