import type { ReactNode } from "react";

export default function ManagePlansLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">{children}</div>
  );
}
