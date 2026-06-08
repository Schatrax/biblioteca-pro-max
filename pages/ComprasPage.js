import { expect } from '@playwright/test';

export class ComprasPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/compras.html');
  }

  async createPurchase({ bookId, bookName, quantity }) {
    await expect(this.page.locator('body')).toContainText(bookName);

    const buyButton = this.page.locator(`button[onclick="comprarLivro(${bookId})"]`);
    await expect(buyButton).toBeVisible();

    const bookCard = buyButton.locator('xpath=ancestor::div[contains(@class, "card")][1]');
    const quantityInput = bookCard.locator('input[type="number"]').first();

    await expect(quantityInput).toBeVisible();
    await quantityInput.fill(String(quantity));

    await buyButton.click();
  }

  async expectPurchaseVisible({ bookId, status = 'PENDENTE' }) {
    await this.page.goto('/minhas-compras.html');

    await expect(this.page.locator('body')).toContainText(`Livro ID: ${bookId}`);
    await expect(this.page.locator('body')).toContainText(status);
  }
}