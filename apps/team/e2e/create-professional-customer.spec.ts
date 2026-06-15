import { expect, test } from "@playwright/test";

const BASE_URL = "http://localhost:4002";
const ADMIN_EMAIL = "admin1@yopmail.com";
const ADMIN_PASSWORD = "Admin@123";

async function login(page: import("@playwright/test").Page) {
	await page.goto(`${BASE_URL}/login`);
	await page.getByPlaceholder("Ange användarnamn eller e-post").fill(ADMIN_EMAIL);
	await page.getByPlaceholder("Ange ditt lösenord").fill(ADMIN_PASSWORD);
	await page.getByRole("button", { name: "Logga in" }).click();
	await page.waitForURL("**/dashboard");
}

async function selectRadixOption(
	page: import("@playwright/test").Page,
	triggerRef: string,
	optionName: string,
) {
	await page.locator(`aria-ref=${triggerRef}`).click();
	await page.getByRole("option", { name: optionName, exact: true }).click();
}

async function scrollAndClickCity(
	page: import("@playwright/test").Page,
	cityName: string,
) {
	await page.evaluate((city) => {
		const viewport = document.querySelector("[data-radix-select-viewport]") as HTMLElement;
		if (!viewport) return;
		const items = viewport.querySelectorAll<HTMLElement>('[data-slot="select-item"]');
		const target = Array.from(items).find((el) => el.textContent?.trim() === city);
		if (target) {
			target.scrollIntoView();
			target.click();
		}
	}, cityName);
}

test.describe("Create Professional Customer", () => {
	test.beforeEach(async ({ page }) => {
		await login(page);
	});

	test("completes the 4-step creation form and creates a new customer account", async ({
		page,
	}) => {
		const companyName = `Test Playwright AB ${Date.now()}`;

		// Navigate to Professional users list
		await page.getByRole("button", { name: "customerUsers" }).click();
		await page.waitForURL("**/customers/professional");

		// Open creation modal
		await page.getByRole("button", { name: /Skapa Kund konto/i }).click();
		await expect(page.getByRole("heading", { name: "Skapa kund konto" })).toBeVisible();
		await expect(page.getByText("Steg 1 av 4")).toBeVisible();

		// ── Step 1: Företagsuppgifter ──────────────────────────────────────────
		await page.getByPlaceholder("Ange företagsnamn").fill(companyName);
		await page.getByPlaceholder("XXXXXX-XXXX").fill("556789-1234");

		// Kategori dropdown (Radix)
		await page.getByRole("combobox").filter({ hasText: "Kategori" }).click();
		await page.getByRole("option", { name: "Bygg", exact: true }).click();

		// Stad dropdown (Radix — requires scrolling through a long list)
		await page.getByRole("combobox").filter({ hasText: "Stad" }).click();
		await scrollAndClickCity(page, "Gothenburg");

		await expect(page.getByRole("button", { name: "Nästa" })).toBeEnabled();
		await page.getByRole("button", { name: "Nästa" }).click();
		await expect(page.getByText("Steg 2 av 4")).toBeVisible();

		// ── Step 2: Kontaktperson ──────────────────────────────────────────────
		await page.getByPlaceholder("Namn").fill("Test Kontakt");
		await page.getByPlaceholder("namn@foretag.se").fill("kontakt@testplaywright.se");
		await page.getByPlaceholder("0XX XXX XX XX").fill("070 123 45 67");

		await expect(page.getByRole("button", { name: "Nästa" })).toBeEnabled();
		await page.getByRole("button", { name: "Nästa" }).click();
		await expect(page.getByText("Steg 3 av 4")).toBeVisible();

		// ── Step 3: Erbjudande ─────────────────────────────────────────────────
		await page.getByRole("combobox").click();
		await page.getByRole("option", { name: "Standard" }).click();

		await page.getByPlaceholder("1500").fill("1500");
		await page.getByPlaceholder("0", { exact: true }).fill("10");
		await page.getByRole("textbox").fill("2026-06-15");

		await expect(page.getByRole("button", { name: "Nästa" })).toBeEnabled();
		await page.getByRole("button", { name: "Nästa" }).click();
		await expect(page.getByText("Steg 4 av 4")).toBeVisible();

		// ── Step 4: Granska och skicka faktura ────────────────────────────────
		await expect(page.getByText(companyName)).toBeVisible();
		await expect(page.getByText("556789-1234")).toBeVisible();
		await expect(page.getByText("Standard")).toBeVisible();
		await expect(page.getByText("1500 SEK/mån")).toBeVisible();

		await page.getByRole("button", { name: "Skicka faktura" }).click();

		// Modal closes and new account appears in the list
		await expect(page.getByRole("dialog")).not.toBeVisible({ timeout: 10_000 });
		await expect(page.getByRole("cell", { name: companyName })).toBeVisible();
	});

	test("Nästa button is disabled until all required fields in step 1 are filled", async ({
		page,
	}) => {
		await page.getByRole("button", { name: "customerUsers" }).click();
		await page.waitForURL("**/customers/professional");
		await page.getByRole("button", { name: /Skapa Kund konto/i }).click();

		const nextBtn = page.getByRole("button", { name: "Nästa" });
		await expect(nextBtn).toBeDisabled();

		await page.getByPlaceholder("Ange företagsnamn").fill("Some Company");
		await expect(nextBtn).toBeDisabled();

		await page.getByPlaceholder("XXXXXX-XXXX").fill("556000-0000");
		await expect(nextBtn).toBeDisabled();

		// Select Kategori
		await page.getByRole("combobox").filter({ hasText: "Kategori" }).click();
		await page.getByRole("option", { name: "Bygg", exact: true }).click();
		await expect(nextBtn).toBeDisabled();

		// Select Stad — button only becomes enabled once all 4 fields are filled
		await page.getByRole("combobox").filter({ hasText: "Stad" }).click();
		await scrollAndClickCity(page, "Gothenburg");
		await expect(nextBtn).toBeEnabled();
	});
});
