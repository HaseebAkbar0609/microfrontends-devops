"use client";
import { useSearchParams } from "next/navigation";
import UserEditor from "../live/UserEditor";
import { State } from "../live/ui";
export default function UserSettings() {
  const id = useSearchParams().get("userId");
  return id ? <UserEditor id={id} /> : <State error={new Error("Missing user")} />;
}
