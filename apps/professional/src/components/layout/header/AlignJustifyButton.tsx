"use client";

import { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  AlignJustify,
  ZoomIn,
  ZoomOut,
  Printer,
  LogOut,
  CloudDownload,
  CloudUpload,
  FileSpreadsheet,
  FileText,
  FileCode,
  CheckCircle,
} from "lucide-react";

import HeaderIconButton from "./HeaderIconButton";
import { SLATE } from "@/constants/colors";
import { logoutAPIAction } from "@/api-actions/auth/logout";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/authStorage";
import { useAuthStatus } from "@/context/AuthContext";

const AlignJustifyButton = () => {
  const router = useRouter();
  const { clearSession } = useAuthStatus();
  const t = useTranslate();

  // Zoom State
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (document.body.style as CSSStyleDeclaration & { zoom?: string }).zoom = `${zoomLevel}%`;
    }
  }, [zoomLevel]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(150, prev + 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(50, prev - 10));

  // Export Modal State
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"xlsx" | "csv" | "se" | "pdf">("xlsx");

  // Import Modal State & File Input Ref
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importedFileName, setImportedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const content = "TimeFlow Export Data";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeflow_export_${Date.now()}.${selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportDialogOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportedFileName(file.name);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <HeaderIconButton aria-label="Menu">
            <AlignJustify className="w-5 h-5 sm:w-6 sm:h-6" color={SLATE[800]} />
          </HeaderIconButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 px-2.5 py-3">
          {/* Zoom Section */}
          <div className="flex items-center justify-between px-2 py-2 bg-gray-100 rounded-md">
            <span className="text-sm font-medium text-slate-700">
              <Translate text={localizationConstants.zoom} />
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-40 cursor-pointer"
                aria-label={t(localizationConstants.zoomOut)}
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold text-slate-900 w-10 text-center select-none">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 150}
                className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-40 cursor-pointer"
                aria-label={t(localizationConstants.zoomIn)}
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Print */}
          <DropdownMenuItem
            className="gap-3 cursor-pointer"
            onClick={() => window.print()}
          >
            <Printer className="w-5 h-5 text-slate-700" strokeWidth={2} />
            <span className="text-slate-700 font-medium">
              <Translate text={localizationConstants.print} />
            </span>
          </DropdownMenuItem>

          {/* Export */}
          <DropdownMenuItem
            className="gap-3 cursor-pointer"
            onClick={() => setExportDialogOpen(true)}
          >
            <CloudDownload className="w-5 h-5 text-slate-700" strokeWidth={2} />
            <span className="text-slate-700 font-medium">
              <Translate text={localizationConstants.exportFiles} />
            </span>
          </DropdownMenuItem>

          {/* Import */}
          <DropdownMenuItem
            className="gap-3 cursor-pointer"
            onClick={() => setImportDialogOpen(true)}
          >
            <CloudUpload className="w-5 h-5 text-slate-700" strokeWidth={2} />
            <span className="text-slate-700 font-medium">
              <Translate text={localizationConstants.importFiles} />
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            className="gap-3 text-red-600 focus:text-red-600 cursor-pointer"
            onClick={async () => {
              await logoutAPIAction({
                refresh_token: authStorage.getRefreshToken() ?? "",
              });
              clearSession();
              router.push("/login");
            }}
          >
            <LogOut className="w-4 h-4 text-red-600" />
            <span className="font-medium">
              <Translate text={localizationConstants.logout} />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Translate text={localizationConstants.exportFiles} />
            </DialogTitle>
            <DialogDescription>
              Välj filformat för export (Excel, SIE, PDF eller CSV).
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-4">
            <button
              type="button"
              onClick={() => setSelectedFormat("xlsx")}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedFormat === "xlsx"
                  ? "border-[#111721] bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Excel (.xlsx)</p>
                <p className="text-xs opacity-75">Kalkylblad</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat("se")}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedFormat === "se"
                  ? "border-[#111721] bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FileCode className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">SIE (.se)</p>
                <p className="text-xs opacity-75">Bokföringsfil</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat("pdf")}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedFormat === "pdf"
                  ? "border-[#111721] bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">PDF (.pdf)</p>
                <p className="text-xs opacity-75">Dokument</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFormat("csv")}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedFormat === "csv"
                  ? "border-[#111721] bg-slate-900 text-white shadow-xs"
                  : "border-slate-200 hover:bg-slate-100 text-slate-800"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-sm font-semibold">CSV (.csv)</p>
                <p className="text-xs opacity-75">Kommaseparerad</p>
              </div>
            </button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={handleExport} className="bg-[#111721] text-white hover:bg-slate-800">
              Exportera
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <Translate text={localizationConstants.importFiles} />
            </DialogTitle>
            <DialogDescription>
              Stöder Excel (.xlsx, .csv), SIE (.se) och PDF (.pdf) filer.
            </DialogDescription>
          </DialogHeader>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.csv,.se,.pdf"
            className="hidden"
          />

          <div className="py-4">
            {importedFileName ? (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="flex-1 truncate">
                  <p className="text-sm font-semibold truncate">{importedFileName}</p>
                  <p className="text-xs text-emerald-700">Klar för import</p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 bg-slate-50 transition-colors cursor-pointer"
              >
                <CloudUpload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm font-semibold text-slate-700">Klicka för att välja fil</p>
                <p className="text-xs text-slate-500 mt-1">.xlsx, .csv, .se, .pdf</p>
              </button>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setImportedFileName(null);
                setImportDialogOpen(false);
              }}
            >
              Stäng
            </Button>
            {importedFileName && (
              <Button
                onClick={() => {
                  setImportedFileName(null);
                  setImportDialogOpen(false);
                }}
                className="bg-[#111721] text-white hover:bg-slate-800"
              >
                Importera
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlignJustifyButton;
