"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlignJustify,
  ZoomIn,
  ZoomOut,
  Printer,
  LogOut,
  CloudDownload,
  CloudUpload,
} from "lucide-react";

import HeaderIconButton from "./HeaderIconButton";
import { SLATE } from "@/constants/colors";
import { logoutAPIAction } from "@/api-actions/auth/logout";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/authStorage";
import { useAuthStatus } from "@/context/AuthContext";

const AlignJustifyButton = () => {
  const router = useRouter();
  const { clearSession } = useAuthStatus();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <HeaderIconButton aria-label="Menu">
          <AlignJustify className="w-5 h-5 sm:w-6 sm:h-6" color={SLATE[800]} />
        </HeaderIconButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 px-2.5 py-3">
        {/* Zoom Section */}
        <div className="flex items-center justify-between px-2 py-2 bg-gray-200 rounded-md">
          <span className="text-sm text-slate-700">Zoom</span>

          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-slate-700" />
            <span className="text-sm text-slate-700">100%</span>
            <ZoomIn className="w-4 h-4 text-slate-700" />
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Print */}
        <DropdownMenuItem className="gap-3">
          <Printer className="w-5 h-5 text-slate-700" strokeWidth={2} />
          <span className="text-slate-700 font-medium"> Print</span>
        </DropdownMenuItem>

        {/* Export */}
        <DropdownMenuItem className="gap-3">
          <CloudDownload className="w-5 h-5 text-slate-700" strokeWidth={2} />
          <span className="text-slate-700 font-medium">Export Files</span>
        </DropdownMenuItem>

        {/* Import */}
        <DropdownMenuItem className="gap-3">
          <CloudUpload className="w-5 h-5 text-slate-700" strokeWidth={2} />
          <span className="text-slate-700 font-medium">Import Files</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem
          className="gap-3 text-red-600 focus:text-red-600"
          onClick={async () => {
            await logoutAPIAction({
              refresh_token: authStorage.getRefreshToken() ?? "",
            });
            clearSession();
            router.push("/login");
            // router.refresh();
          }}
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <Translate text={localizationConstants.logout} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlignJustifyButton;
