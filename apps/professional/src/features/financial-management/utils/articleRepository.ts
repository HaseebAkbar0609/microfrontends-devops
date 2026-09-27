import type {
	ArticleRow,
	ArticleDetail,
	SupplierArticleRow,
	SupplierArticleDetail,
	CreateArticleFormData,
	ArticleImportMapping,
} from "../types/article.types";
import {
	STORAGE_KEY_ARTICLES,
	STORAGE_KEY_SUPPLIER_ARTICLES,
} from "../constants/article.constants";
import {
	MOCK_ARTICLE_LIST,
	MOCK_SUPPLIER_ARTICLE_LIST,
} from "../mock/articleMockData";

type Listener = () => void;

class ArticleRepository {
	private articles: ArticleDetail[] = [];
	private supplierArticles: SupplierArticleDetail[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (typeof window === "undefined") {
			this.articles = [...MOCK_ARTICLE_LIST];
			this.supplierArticles = [...MOCK_SUPPLIER_ARTICLE_LIST];
			this.isInitialized = true;
			return;
		}

		try {
			const storedArticles = localStorage.getItem(STORAGE_KEY_ARTICLES);
			if (storedArticles) {
				const parsed = JSON.parse(storedArticles);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.articles = parsed;
				} else {
					this.articles = [...MOCK_ARTICLE_LIST];
					this.persistArticles();
				}
			} else {
				this.articles = [...MOCK_ARTICLE_LIST];
				this.persistArticles();
			}

			const storedSupplier = localStorage.getItem(STORAGE_KEY_SUPPLIER_ARTICLES);
			if (storedSupplier) {
				const parsed = JSON.parse(storedSupplier);
				if (Array.isArray(parsed) && parsed.length > 0) {
					this.supplierArticles = parsed;
				} else {
					this.supplierArticles = [...MOCK_SUPPLIER_ARTICLE_LIST];
					this.persistSupplierArticles();
				}
			} else {
				this.supplierArticles = [...MOCK_SUPPLIER_ARTICLE_LIST];
				this.persistSupplierArticles();
			}
		} catch {
			this.articles = [...MOCK_ARTICLE_LIST];
			this.supplierArticles = [...MOCK_SUPPLIER_ARTICLE_LIST];
		}

		this.isInitialized = true;
	}

	private ensureInitialized(): void {
		if (!this.isInitialized) {
			this.init();
		}
	}

	private persistArticles(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(this.articles));
		} catch {
			// localStorage error fallback
		}
	}

	private persistSupplierArticles(): void {
		if (typeof window === "undefined") return;
		try {
			localStorage.setItem(STORAGE_KEY_SUPPLIER_ARTICLES, JSON.stringify(this.supplierArticles));
		} catch {
			// localStorage error fallback
		}
	}

	private notify(): void {
		for (const listener of this.listeners) {
			try {
				listener();
			} catch {
				// Ignore listener errors
			}
		}
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	public getAll(): ArticleDetail[] {
		this.ensureInitialized();
		return [...this.articles];
	}

	public getById(id: string): ArticleDetail | undefined {
		this.ensureInitialized();
		return this.articles.find((a) => a.id === id || a.articleNo === id);
	}

	public add(formData: CreateArticleFormData): ArticleDetail {
		this.ensureInitialized();
		const newId = `art_${Date.now()}`;
		const nextNr = String(1000 + this.articles.length + 1);

		const newArticle: ArticleDetail = {
			id: newId,
			isFavorite: false,
			articleNo: formData.articleNr || nextNr,
			description: formData.benamning,
			benamning: formData.benamning,
			ean: formData.ean || "",
			leverantor: formData.leverantor || "",
			husarbete: formData.husarbete || "nej",
			supplierArticleNo: formData.supplierArticleNo || "",
			typHusarbete: formData.typHusarbete || "",
			enhet: formData.enhet || "Styck",
			typAvArtikel: formData.typAvArtikel || "Vara",
			lagerVara: formData.lagerVara || "Nej",
			forsaljning: formData.forsaljning || "3001",
			moms: formData.moms || "25%",
			forsaljningSE: formData.forsaljningSE || "",
			forsaljningEU: formData.forsaljningEU || "",
			lagerkonto: formData.lagerkonto || "",
			forsaljningEUMoms: formData.forsaljningEUMoms || "",
			forsaljningExport: formData.forsaljningExport || "",
			inkop: formData.inkop || "",
			priserA: formData.priserA || "0,00",
			europrislista: formData.europrislista || "",
			kampanj: formData.kampanj || "",
			vipPriser: formData.vipPriser || "",
			kalkylkostnad: formData.kalkylkostnad || "0,00",
			bestallningspunkt: formData.bestallningspunkt || "0",
			iLager: formData.iLager || "0",
			outPriceListA: `${formData.priserA || "0,00"} kr`,
			calculatedCost: `${formData.kalkylkostnad || "0,00"} kr`,
			stock: formData.stock || formData.iLager || "0",
			reserved: formData.reserved || "0",
			available: formData.stock || formData.iLager || "0",
			stockValue: "0,00 kr",
			status: formData.status || "active",
			vikt: formData.vikt || "",
			langd: formData.langd || "",
			bredd: formData.bredd || "",
			hojd: formData.hojd || "",
			material: formData.material || "",
			forsaljningSESkattskyldighet: formData.forsaljningSESkattskyldighet || "",
			momsSESkattskyldighet: formData.momsSESkattskyldighet || "",
			forsaljningEUSkattskyldighet: formData.forsaljningEUSkattskyldighet || "",
			lagerforandring: formData.lagerforandring || "",
			priceListRows: formData.priceListRows || [],
		};

		this.articles.unshift(newArticle);
		this.persistArticles();
		this.notify();
		return newArticle;
	}

	public update(id: string, updates: Partial<CreateArticleFormData>): ArticleDetail | undefined {
		this.ensureInitialized();
		const index = this.articles.findIndex((a) => a.id === id || a.articleNo === id);
		if (index === -1) return undefined;

		const existing = this.articles[index];
		const updated: ArticleDetail = {
			...existing,
			...updates,
			description: updates.benamning ?? existing.description,
			benamning: updates.benamning ?? existing.benamning,
			outPriceListA: updates.priserA ? `${updates.priserA} kr` : existing.outPriceListA,
			calculatedCost: updates.kalkylkostnad ? `${updates.kalkylkostnad} kr` : existing.calculatedCost,
		};

		this.articles[index] = updated;
		this.persistArticles();
		this.notify();
		return updated;
	}

	public delete(id: string): boolean {
		this.ensureInitialized();
		const index = this.articles.findIndex((a) => a.id === id || a.articleNo === id);
		if (index === -1) return false;

		this.articles.splice(index, 1);
		this.persistArticles();
		this.notify();
		return true;
	}

	public toggleFavorite(id: string): boolean {
		this.ensureInitialized();
		const found = this.articles.find((a) => a.id === id || a.articleNo === id);
		if (!found) return false;

		found.isFavorite = !found.isFavorite;
		this.persistArticles();
		this.notify();
		return found.isFavorite;
	}

	public importArticles(items: Partial<CreateArticleFormData>[]): number {
		this.ensureInitialized();
		let addedCount = 0;

		items.forEach((item, idx) => {
			if (!item.benamning && !item.articleNr) return;
			const newId = `art_imported_${Date.now()}_${idx}`;
			const nextNr = item.articleNr || String(1000 + this.articles.length + 1);

			const newArticle: ArticleDetail = {
				id: newId,
				isFavorite: false,
				articleNo: nextNr,
				description: item.benamning || `Importerad artikel ${nextNr}`,
				benamning: item.benamning || `Importerad artikel ${nextNr}`,
				ean: item.ean || "",
				leverantor: item.leverantor || "Allmän leverantör",
				husarbete: item.husarbete || "nej",
				supplierArticleNo: item.supplierArticleNo || "",
				typHusarbete: item.typHusarbete || "",
				enhet: item.enhet || "Styck",
				typAvArtikel: item.typAvArtikel || "Vara",
				lagerVara: item.lagerVara || "Ja",
				forsaljning: item.forsaljning || "3001",
				moms: item.moms || "25%",
				forsaljningSE: item.forsaljningSE || "",
				forsaljningEU: item.forsaljningEU || "",
				lagerkonto: item.lagerkonto || "",
				forsaljningEUMoms: item.forsaljningEUMoms || "",
				forsaljningExport: item.forsaljningExport || "",
				inkop: item.inkop || "",
				priserA: item.priserA || "0,00",
				europrislista: item.europrislista || "",
				kampanj: item.kampanj || "",
				vipPriser: item.vipPriser || "",
				kalkylkostnad: item.kalkylkostnad || "0,00",
				bestallningspunkt: item.bestallningspunkt || "0",
				iLager: item.iLager || "0",
				outPriceListA: `${item.priserA || "0,00"} kr`,
				calculatedCost: `${item.kalkylkostnad || "0,00"} kr`,
				stock: item.stock || item.iLager || "0",
				reserved: "0",
				available: item.stock || item.iLager || "0",
				stockValue: "0,00 kr",
				status: item.status || "active",
				vikt: item.vikt || "",
				langd: item.langd || "",
				bredd: item.bredd || "",
				hojd: item.hojd || "",
				material: item.material || "",
				forsaljningSESkattskyldighet: item.forsaljningSESkattskyldighet || "",
				momsSESkattskyldighet: item.momsSESkattskyldighet || "",
				forsaljningEUSkattskyldighet: item.forsaljningEUSkattskyldighet || "",
				lagerforandring: item.lagerforandring || "",
				priceListRows: [],
			};

			this.articles.unshift(newArticle);
			addedCount++;
		});

		if (addedCount > 0) {
			this.persistArticles();
			this.notify();
		}

		return addedCount;
	}

	public getAllSupplierArticles(): SupplierArticleDetail[] {
		this.ensureInitialized();
		return [...this.supplierArticles];
	}

	public getSupplierArticleById(id: string): SupplierArticleDetail | undefined {
		this.ensureInitialized();
		return this.supplierArticles.find(
			(a) => a.id === id || a.supplierArticleNo === id,
		);
	}

	public updateSupplierArticle(
		id: string,
		updates: Partial<SupplierArticleDetail>,
	): SupplierArticleDetail | null {
		this.ensureInitialized();
		const index = this.supplierArticles.findIndex(
			(a) => a.id === id || a.supplierArticleNo === id,
		);
		if (index === -1) return null;

		const existing = this.supplierArticles[index];
		const updated: SupplierArticleDetail = {
			...existing,
			...updates,
		};

		this.supplierArticles[index] = updated;
		this.persistSupplierArticles();
		this.notify();
		return updated;
	}

	public deleteSupplierArticle(id: string): boolean {
		this.ensureInitialized();
		const index = this.supplierArticles.findIndex(
			(a) => a.id === id || a.supplierArticleNo === id,
		);
		if (index === -1) return false;

		this.supplierArticles.splice(index, 1);
		this.persistSupplierArticles();
		this.notify();
		return true;
	}
}

export const articleRepository = new ArticleRepository();

// API Action bridge functions for components & hooks
export async function getArticlesAPIAction(): Promise<{ data: ArticleRow[]; totalItems: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = articleRepository.getAll();
			resolve({
				data,
				totalItems: data.length,
			});
		}, 100);
	});
}

export async function getArticleDetailAPIAction(id: string): Promise<ArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const found = articleRepository.getById(id);
			if (found) {
				resolve(found);
			} else {
				reject(new Error("Article not found"));
			}
		}, 100);
	});
}

export async function createArticleAPIAction(formData: CreateArticleFormData): Promise<ArticleDetail> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const created = articleRepository.add(formData);
			resolve(created);
		}, 150);
	});
}

export async function updateArticleAPIAction(
	id: string,
	formData: Partial<CreateArticleFormData>,
): Promise<ArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const updated = articleRepository.update(id, formData);
			if (updated) {
				resolve(updated);
			} else {
				reject(new Error("Article not found"));
			}
		}, 150);
	});
}

export async function deleteArticleAPIAction(id: string): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			articleRepository.delete(id);
			resolve();
		}, 100);
	});
}

export async function toggleArticleFavoriteAPIAction(id: string): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const newState = articleRepository.toggleFavorite(id);
			resolve(newState);
		}, 80);
	});
}

export async function getSupplierArticlesAPIAction(): Promise<{ data: SupplierArticleRow[]; totalItems: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = articleRepository.getAllSupplierArticles();
			resolve({
				data,
				totalItems: data.length,
			});
		}, 100);
	});
}

export async function getSupplierArticleDetailAPIAction(id: string): Promise<SupplierArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const found = articleRepository.getSupplierArticleById(id);
			if (found) {
				resolve(found);
			} else {
				reject(new Error("Supplier article not found"));
			}
		}, 100);
	});
}

export async function updateSupplierArticleAPIAction(
	id: string,
	updates: Partial<SupplierArticleDetail>,
): Promise<SupplierArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const updated = articleRepository.updateSupplierArticle(id, updates);
			if (updated) {
				resolve(updated);
			} else {
				reject(new Error("Supplier article not found"));
			}
		}, 100);
	});
}

export async function deleteSupplierArticleAPIAction(id: string): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			articleRepository.deleteSupplierArticle(id);
			resolve();
		}, 100);
	});
}

export async function importArticleAPIAction(
	_file: File,
	mapping: ArticleImportMapping,
	rows?: Record<string, string>[],
): Promise<{ successCount: number; failureCount: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			if (!rows || rows.length === 0) {
				resolve({ successCount: 0, failureCount: 0 });
				return;
			}

			// Map each row according to the mapping
			const mappedArticles: Partial<CreateArticleFormData>[] = rows.map((row) => {
				const item: Record<string, string> = {};
				Object.entries(mapping).forEach(([fieldKey, fileCol]) => {
					if (fileCol && row[fileCol] !== undefined) {
						item[fieldKey] = row[fileCol];
					}
				});
				return item as Partial<CreateArticleFormData>;
			});

			const importedCount = articleRepository.importArticles(mappedArticles);
			resolve({
				successCount: importedCount,
				failureCount: rows.length - importedCount,
			});
		}, 250);
	});
}

export async function downloadArticleImportTemplateAPIAction(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const templateCsv =
				"Artikelnummer;Benämning;EAN;Leverantör;Enhet;Typ;Försäljning;Moms;Pris A;Kalkylkostnad;Lager;Vikt;Material\n" +
				"1001;Konsulttimme Senior Utvecklare;7350012345678;Acme Nordic AB;Tim;Tjänst;3001;25%;1250,00;650,00;0;0;N/A\n" +
				"1002;Nätverkskabel Cat6A 50m;7350055544332;Kabel Grossisten AB;Styck;Vara;3020;25%;499,00;180,00;45;2.5;Koppar/PVC\n" +
				"1003;Programvarulicens Årskvot;7350098765432;Nordic Cloud Solutions;Styck;Vara;3010;25%;4500,00;2500,00;25;0.1;Digital";
			const blob = new Blob([templateCsv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "artikel_import_mall.csv";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			resolve();
		}, 150);
	});
}
