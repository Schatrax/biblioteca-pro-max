import { expect } from '@playwright/test';

export class AprovacoesPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/aprovacoes.html');
  }

  async approveFirstPendingRental() {
    const approveButton = this.page.getByRole('button', { name: /aprovar/i }).first();

    await expect(approveButton).toBeVisible();
    await approveButton.click();
  }

  async expectApprovedStatusVisible() {
    await expect(this.page.locator('body')).toContainText(/APROVADO/i);
  }
}