import { Suspense } from "react";
import UserSettings from "@/features/admin/users/components/UserSettings";

export default function Page() {
    return (
        <Suspense fallback={<div className="p-6 text-slate-500">Loading settings...</div>}>
            <UserSettings />
        </Suspense>
    );
}
