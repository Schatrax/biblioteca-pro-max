import { expect } from '@playwright/test';

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Email:', exact: true });
        this.passwordInput = page.getByRole('textbox', { name: 'Senha:', exact: true });
        this.loginButton = page.getByRole('button', { name: /entrar/i });
    }

    async goto() {
        await this.page.goto('/login.html');
    }

    async login(email, senha) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(senha);
        await this.loginButton.click();
    }

    async expectOnLoginPage() {
        await expect(this.page).toHaveURL(/login\.html/);
    }
}