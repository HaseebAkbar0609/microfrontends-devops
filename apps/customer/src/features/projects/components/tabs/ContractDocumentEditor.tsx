"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { useState, useRef } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ImageIcon,
  TableIcon,
  Code,
  Link,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

const DEFAULT_CONTENT = `<h1>KONTRAKT</h1>
<p>Avtalsnummer: KA-2025-001</p>
<p>Datum: 2025-01-10</p>
<h2>1. PARTER</h2>
<p>Detta konsultavtal ("Avtalet") har denna dag ingåtts mellan:</p>
<p><strong>Uppdragsgivare:</strong> [Företagsnamn]<br>Organisationsnummer: [Org.nr]<br>Adress: [Adress]</p>
<p><strong>Konsult:</strong> [Konsultens namn]<br>Personnummer: [Personnummer]<br>Adress: [Adress]</p>
<h2>2. UPPDRAGETS OMFATTNING</h2>
<p>Konsulten åtar sig att utföra följande tjänster för Uppdragsgivaren:</p>
<ul>
  <li>Rådgivning och expertis inom [område]</li>
  <li>Deltagande i projektmöten och workshops</li>
  <li>Dokumentation och rapportering av utfört arbete</li>
</ul>
<h2>3. AVTALSTID</h2>
<p>Avtalet gäller från och med [startdatum] till och med [slutdatum], såvida det inte sägs upp eller förlängs enligt punkterna i detta avtal.</p>
<h2>4. ERSÄTTNING OCH BETALNINGSVILLKOR</h2>
<p>4.1 Konsulten erhåller en timersättning om [belopp] SEK exklusive moms.</p>
<p>4.2 Fakturering sker månadsvis i efterskott.</p>
<p>4.3 Betalningsvillkor är 30 dagar netto från fakturadatum.</p>
<h2>5. SEKRETESS</h2>
<p>Konsulten förbinder sig att hålla sekretess om information om Uppdragsgivarens verksamhet, kunder och affärsrelationer som Konsulten får del av i samband med uppdraget.</p>
<h2>6. IMMATERIELLT</h2>
<p>Uppdragsgivaren äger rätten till allt material och alla arbetsmaterial som framställts av Konsulten inom ramen för detta uppdrag.</p>
<br>
<p>___________________________&nbsp;&nbsp;&nbsp;&nbsp;___________________________</p>
<p>Uppdragsgivare &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Konsult</p>
<p>Ort och datum &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Ort och datum</p>`;

const ELEMENT_SNIPPETS: Record<string, string> = {
  logo: '<p><strong>[LOGO]</strong></p>',
  header: '<h1>Header Text</h1>',
  footer: '<p><em>Footer — Confidential</em></p>',
  paragraph: '<p>Add your paragraph text here.</p>',
  table: '',
  signature: '<p>___________________________</p><p>Signature &nbsp;&nbsp;&nbsp;&nbsp; Date</p>',
};

const FORMATS = [
  { label: "Paragraph", action: "paragraph" },
  { label: "Heading 1", action: "h1" },
  { label: "Heading 2", action: "h2" },
  { label: "Heading 3", action: "h3" },
];

interface ContractDocumentEditorProps {
  onBack: () => void;
  onSave?: () => void;
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`h-8 w-8 flex items-center justify-center rounded transition-colors ${
        active
          ? "bg-slate-200 text-[#09090B]"
          : "hover:bg-slate-100 text-[#475569]"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-[#E2E8F0] mx-1" />;
}

export function ContractDocumentEditor({
  onBack,
  onSave,
}: ContractDocumentEditorProps) {
  const t = useTranslate();
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("Turnkey project");
  const [activeElement, setActiveElement] = useState<string | null>("logo");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: DEFAULT_CONTENT,
    editorProps: {
      attributes: {
        class: "min-h-[640px] focus:outline-none tiptap-doc",
      },
    },
  });

  const insertElement = (key: string) => {
    if (!editor) return;
    if (key === "table") {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    } else {
      const html = ELEMENT_SNIPPETS[key];
      if (html) editor.chain().focus().insertContent(html).run();
    }
  };

  const applyFormat = (action: string) => {
    if (!editor) return;
    if (action === "paragraph") editor.chain().focus().setParagraph().run();
    else if (action === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
    else if (action === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
    else if (action === "h3") editor.chain().focus().toggleHeading({ level: 3 }).run();
    setShowFormatMenu(false);
  };

  const currentFormat = () => {
    if (!editor) return "Paragraph";
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <style>{`
        .tiptap-doc h1 { font-size: 1.875rem; font-weight: 700; line-height: 36px; letter-spacing: 0.4px; margin-bottom: 0.75rem; margin-top: 0; color: #0A0A0A; }
        .tiptap-doc h2 { font-size: 1rem; font-weight: 700; line-height: 24px; letter-spacing: -0.3125px; margin-top: 1.5rem; margin-bottom: 0.5rem; color: #0A0A0A; }
        .tiptap-doc h3 { font-size: 0.875rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.375rem; color: #0A0A0A; }
        .tiptap-doc p  { font-size: 0.875rem; line-height: 23px; letter-spacing: -0.15px; margin-bottom: 0.5rem; color: #0A0A0A; }
        .tiptap-doc ul, .tiptap-doc ol { padding-left: 1.5rem; margin-bottom: 0.75rem; }
        .tiptap-doc li { font-size: 0.875rem; line-height: 23px; letter-spacing: -0.15px; color: #0A0A0A; margin-bottom: 0.25rem; }
        .tiptap-doc table { border-collapse: collapse; width: 100%; margin-bottom: 0.75rem; }
        .tiptap-doc th, .tiptap-doc td { border: 1px solid #CBD5E1; padding: 0.4rem 0.6rem; font-size: 0.8125rem; }
        .tiptap-doc th { background: #F8FAFC; font-weight: 600; }
        .tiptap-doc code { background: #F1F5F9; padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-size: 0.8125rem; }
        .tiptap-doc pre { background: #1E293B; color: #E2E8F0; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem; overflow-x: auto; }
        .tiptap-doc pre code { background: transparent; color: inherit; padding: 0; }
        .tiptap-doc a { color: #2563EB; text-decoration: underline; }
        .tiptap-doc blockquote { border-left: 3px solid #CBD5E1; padding-left: 1rem; color: #64748B; margin-bottom: 0.75rem; }
        .tiptap-doc .selectedCell { background-color: #EFF6FF; }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-start gap-3 px-4 pt-6 pb-6">
        <button
          type="button"
          onClick={onBack}
          className="mt-1 shrink-0 transition-colors hover:opacity-70"
          aria-label="Back"
        >
          <Image src="/assets/icons/arrow-left.svg" alt="Back" width={24} height={24} />
        </button>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold text-[#020617] leading-none tracking-[-0.6px]">
            <Translate text={localizationConstants.projectCreateNewLabel} />
          </h2>
          <p className="text-sm text-[#64748B]">
            <Translate text={localizationConstants.contractCreateSubtitle} />
          </p>
        </div>
        {onSave && (
          <Button
            type="button"
            onClick={onSave}
            className="ml-auto h-9 px-5 text-sm font-medium bg-[#18181B] hover:bg-[#18181B]/90 text-white"
          >
            <Translate text={localizationConstants.contractSubmitLabel} />
          </Button>
        )}
      </div>

      {/* ── Main content: canvas column + sidebar ── */}
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
        {/* Toolbar — sits on grey background, no box */}
        <div className="flex items-center gap-1 px-4 py-2 flex-wrap">
        <ToolbarBtn
          active={editor?.isActive("bold")}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive("italic")}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive("strike")}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarBtn>

        <ToolbarDivider />

        {/* Format dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFormatMenu((v) => !v)}
            className="h-8 flex items-center gap-1.5 px-2.5 rounded text-sm font-medium text-[#475569] hover:bg-slate-100 transition-colors"
          >
            <Type className="h-4 w-4" />
            <span>{currentFormat()}</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          {showFormatMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-md z-50 py-1 min-w-35">
              {FORMATS.map((f) => (
                <button
                  key={f.action}
                  type="button"
                  onClick={() => applyFormat(f.action)}
                  className="w-full text-left px-3 py-1.5 text-sm text-[#09090B] hover:bg-slate-50 transition-colors"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ToolbarDivider />

        <ToolbarBtn
          active={editor?.isActive({ textAlign: "left" })}
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive({ textAlign: "center" })}
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive({ textAlign: "right" })}
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive({ textAlign: "justify" })}
          onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </ToolbarBtn>

        <ToolbarDivider />

        <ToolbarBtn
          active={editor?.isActive("bulletList")}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive("orderedList")}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>

        <ToolbarDivider />

        <ToolbarBtn
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor?.isActive("codeBlock")}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarBtn>
        <div className="relative">
          <ToolbarBtn
            active={editor?.isActive("link") || showLinkInput}
            onClick={() => {
              if (editor?.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                setLinkUrl("");
                setShowLinkInput((v) => !v);
              }
            }}
            title="Link"
          >
            <Link className="h-4 w-4" />
          </ToolbarBtn>
          {showLinkInput && (
            <div className="absolute top-9 left-0 z-20 flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-lg shadow-md p-1.5">
              <input
                autoFocus
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (linkUrl) editor?.chain().focus().setLink({ href: linkUrl }).run();
                    setShowLinkInput(false);
                  } else if (e.key === "Escape") {
                    setShowLinkInput(false);
                  }
                }}
                placeholder="https://"
                className="h-7 w-48 px-2 text-xs border border-[#E2E8F0] rounded outline-none focus:border-[#94A3B8]"
              />
              <button
                type="button"
                onClick={() => {
                  if (linkUrl) editor?.chain().focus().setLink({ href: linkUrl }).run();
                  setShowLinkInput(false);
                }}
                className="h-7 px-2 text-xs bg-[#09090B] text-white rounded hover:bg-[#27272A] transition-colors"
              >
                OK
              </button>
            </div>
          )}
        </div>
        </div>

        {/* Document area */}
        <div className="flex-1 overflow-y-auto pt-3 pl-9">
          <div className="px-[46.5px] pt-5 pb-8">
            <div className="max-w-200 bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] rounded-[10px] px-12 pt-12 pb-12 min-h-200 text-sm text-[#09090B]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
        </div>{/* end canvas column */}

        {/* Sidebar */}
        <div className="w-[219px] shrink-0 border-l border-[#E2E8F0] bg-white overflow-y-auto">
          {/* Select Template */}
          <div className="p-[10px] border-b border-[#E2E8F0]">
            <p className="text-sm font-medium text-[#09090B] mb-1">
              <Translate text={localizationConstants.contractSelectTemplateLabel} />
            </p>
            <div className="relative">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full h-9 text-sm border border-[#E4E4E7] rounded-md bg-white px-3 pr-7 appearance-none text-[#71717A] shadow-[0px_1px_2px_rgba(16,24,40,0.05)] focus:outline-none focus:ring-1 focus:ring-slate-300"
              >
                <option>Turnkey project</option>
                <option>Consulting Standard</option>
                <option>Service Contract</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none" />
            </div>
          </div>

          {/* Elements */}
          <div className="p-2">
            <p className="text-xs font-semibold text-[#475569] px-2 py-1.5">
              <Translate text={localizationConstants.contractElementsLabel} />
            </p>
            <div className="flex flex-col gap-1">
              {[
                { key: "logo",      label: t(localizationConstants.contractEditorLogoLabel) },
                { key: "header",    label: t(localizationConstants.contractEditorHeaderLabel) },
                { key: "footer",    label: t(localizationConstants.contractEditorFooterLabel) },
                { key: "paragraph", label: t(localizationConstants.contractEditorParagraphLabel) },
                { key: "table",     label: "Table" },
                { key: "signature", label: t(localizationConstants.contractEditorSignatureLabel) },
              ].map((el) => (
                <button
                  key={el.key}
                  type="button"
                  onClick={() => { insertElement(el.key); setActiveElement(el.key); }}
                  className={`w-full flex items-center gap-2 px-4 h-8 rounded-md text-left transition-colors ${
                    activeElement === el.key
                      ? "bg-[#1E293B]"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <Image
                    src="/assets/icons/folders.svg"
                    alt=""
                    width={16}
                    height={16}
                    className={activeElement === el.key ? "invert brightness-200" : ""}
                  />
                  <span className={`text-sm font-medium ${activeElement === el.key ? "text-[#F1F5F9]" : "text-[#1E293B]"}`}>
                    {el.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              editor?.chain().focus().setImage({ src: reader.result }).run();
            }
          };
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
