import { expect } from '@playwright/test';

export class ArrendamentosPage {
  constructor(page) {
    this.page = page;

    this.bookSelect = page.locator('#livroSelect');
    this.startDateInput = page.locator('input[type="date"]').nth(0);
    this.endDateInput = page.locator('input[type="date"]').nth(1);
    this.submitButton = page.getByRole('button', { name: /solicitar arrendamento/i });
  }

  async goto() {
    await this.page.goto('/arrendamentos.html');
  }

  async requestRental({ bookId, startDate, endDate }) {
    await expect(this.bookSelect).toBeVisible();

    const options = await this.bookSelect.locator('option').allTextContents();
    console.log('Book select options:', options);

    await this.bookSelect.selectOption(String(bookId));
    await this.startDateInput.fill(startDate);
    await this.endDateInput.fill(endDate);
    await this.submitButton.click();
  }

  async expectRentalVisible(bookName) {
    await expect(this.page.locator('body')).toContainText(bookName);
    await expect(this.page.locator('body')).toContainText(/PENDENTE/i);
  }
}