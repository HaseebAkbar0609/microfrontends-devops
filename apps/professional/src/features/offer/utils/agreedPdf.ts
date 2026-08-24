import { OfferAgreedItem } from "../types/offer";

export function generateAndDownloadAgreedPdf(row: OfferAgreedItem): boolean {
  try {
    const title = "TFS AVTAL (AGREEMENT DOCUMENT)";
    const lines = [
      `Kontrakt nr: ${row.contractNr || "-"}`,
      `Uppdrag / Jobb: ${row.jobName || "-"}`,
      `Kundnamn: ${row.customerName || "-"}`,
      `Kommun / Ort: ${row.municipality || "-"}`,
      `Jobb typ: ${row.jobType || "-"}`,
      `Avtalat pris: ${row.agreedPrice > 0 ? `${row.agreedPrice} SEK` : "-"}`,
      `Status: ${row.status === "signed" ? "Avtal signerat" : "Vantar signering"}`,
      `Datum: ${new Date().toISOString().split("T")[0]}`,
    ];

    const escapePdf = (text: string) =>
      text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

    let textStream = `BT\n/F1 18 Tf\n50 760 Td\n(${escapePdf(title)}) Tj\nET\n`;
    textStream += `0.5 w\n50 745 m\n545 745 l\nS\n`;
    let y = 710;
    for (const line of lines) {
      textStream += `BT\n/F1 12 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\nET\n`;
      y -= 25;
    }

    const obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
    const obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
    const obj3 =
      "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n";
    const obj4 =
      "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
    const obj5 = `5 0 obj\n<< /Length ${textStream.length} >>\nstream\n${textStream}\nendstream\nendobj\n`;

    const header = "%PDF-1.4\n";
    const offset1 = header.length;
    const offset2 = offset1 + obj1.length;
    const offset3 = offset2 + obj2.length;
    const offset4 = offset3 + obj3.length;
    const offset5 = offset4 + obj4.length;
    const xrefOffset = offset5 + obj5.length;

    const xref =
      `xref\n0 6\n` +
      `0000000000 65535 f \n` +
      `${String(offset1).padStart(10, "0")} 00000 n \n` +
      `${String(offset2).padStart(10, "0")} 00000 n \n` +
      `${String(offset3).padStart(10, "0")} 00000 n \n` +
      `${String(offset4).padStart(10, "0")} 00000 n \n` +
      `${String(offset5).padStart(10, "0")} 00000 n \n`;

    const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const pdfData = header + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;

    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeContractNr = (row.contractNr || "Avtal").replace(/[^a-zA-Z0-9_-]/g, "_");
    const safeJobName = (row.jobName || "dokument").replace(/[^a-zA-Z0-9_-]/g, "_");
    link.download = `Avtal_${safeContractNr}_${safeJobName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    return true;
  } catch {
    return false;
  }
}
