export function parseCalculationContractSum(value: string): number | undefined {
    const normalized = value.trim().replace(/\s/g, "").replace(/kr$/i, "");
    if (!normalized) return undefined;
    if (!/^\d+([.,]\d{1,2})?$/.test(normalized)) throw new Error("CALCULATION_AMOUNT_INVALID");
    const amount = Number(normalized.replace(",", "."));
    if (!Number.isFinite(amount) || !Number.isSafeInteger(Math.round(amount * 100))) {
        throw new Error("CALCULATION_AMOUNT_INVALID");
    }
    return amount;
}
