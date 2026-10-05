import * as XLSX from "xlsx";

/** A sheet cell: text, or a number Excel can add up. */
export type Cell = string | number;

/**
 * Writes rows as a one-sheet workbook and hands it to the browser, reporting
 * whether it managed to.
 *
 * `aoa_to_sheet` rather than `json_to_sheet`: a sheet with no rows still needs
 * its heading row, and two columns can never collide the way object keys
 * would. Amounts should be given as numbers, not formatted strings, so the
 * reader can add them up at the other end.
 */
export function downloadWorkbook(rows: Cell[][], sheetName: string, fileName: string): boolean {
	try {
		const sheet = XLSX.utils.aoa_to_sheet(rows);
		const book = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(book, sheet, sheetName);
		XLSX.writeFile(book, fileName);
		return true;
	} catch {
		return false;
	}
}
