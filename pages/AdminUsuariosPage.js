import { expect } from '@playwright/test';

export class AdminUsuariosPage {
    constructor(page) {
        this.page = page;

        this.nameInput = page.getByRole('textbox', { name: /nome/i });
        this.emailInput = page.getByRole('textbox', { name: /email/i });
        this.passwordInput = page.getByRole('textbox', { name: /senha/i });
        this.typeSelect = page.locator('select').first();
        this.createButton = page.getByRole('button', { name: /criar usuário|criar usuario/i });
    }

    async goto() {
        await this.page.goto('/admin-usuarios.html');
    }

    async expectAdminPageVisible() {
        await expect(this.page).toHaveURL(/admin-usuarios\.html/);
        await expect(this.page.locator('body')).toContainText(/usuários|usuarios/i);
    }

    async createUser({ nome, email, senha, tipo }) {
        await this.nameInput.fill(nome);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(senha);

        await this.typeSelect.selectOption(String(tipo));

        await this.createButton.click();
    }

    async expectUserVisible(email) {
        await expect(this.getUserRow(email)).toBeVisible();
    }

    getUserRow(email) {
        return this.page.locator('tr').filter({
            has: this.page.locator(`input[type="email"][value="${email}"]`)
        });
    }

    async editUserEmail({ currentEmail, newName, newEmail }) {
        const row = this.getUserRow(currentEmail);

        await expect(row).toBeVisible();

        const inputs = row.locator('input');

        await inputs.nth(0).fill(newName);
        await inputs.nth(1).fill(newEmail);

        await row.getByRole('button', { name: /salvar/i }).click();
    }

    async deleteUser(email) {
        const row = this.getUserRow(email);

        await expect(row).toBeVisible();

        await row.getByRole('button', { name: /excluir|deletar/i }).click();
    }

    async expectUserNotVisible(email) {
        await expect(this.getUserRow(email)).not.toBeVisible();
    }
}