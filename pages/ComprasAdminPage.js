import { expect } from '@playwright/test';

export class ComprasAdminPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/compras-admin.html');
  }

  async approveFirstPendingPurchase() {
    const approveButton = this.page.getByRole('button', { name: /aprovar/i }).first();

    await expect(approveButton).toBeVisible();
    await approveButton.click();
  }

  async expectApprovedPurchaseVisible() {
    await expect(this.page.locator('body')).toContainText(/APROVADA/i);
  }
}