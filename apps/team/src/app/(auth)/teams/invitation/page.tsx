import { Suspense } from "react";
import type { Metadata } from "next";
import TeamInvitationPage from "@/features/auth/components/TeamInvitationPage";

export const metadata: Metadata = { referrer: "no-referrer", robots: { index: false, follow: false } };

export default function Page() {
  return <Suspense><TeamInvitationPage /></Suspense>;
}
