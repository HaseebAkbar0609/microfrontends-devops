import { ATA_CONSTANTS } from "../constants/ata.constants";

export function formatAtaCurrency(amount: number): string {
	return new Intl.NumberFormat("sv-SE").format(Math.round(amount));
}

export function calculateVatAmount(amount: number, vatRate: number = ATA_CONSTANTS.VAT_RATE): number {
	return amount * vatRate;
}

export function formatAtaCount(count: number): string {
	return count < 10 ? `0${count}` : `${count}`;
}
