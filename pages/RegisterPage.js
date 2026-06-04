import { expect } from '@playwright/test';

export class RegisterPage {
    constructor(page) {
        this.page = page;
        this.nameInput = page.getByRole('textbox', { name: 'Nome:', exact: true });
        this.emailInput = page.getByRole('textbox', { name: 'Email:', exact: true });
        this.passwordInput = page.getByRole('textbox', { name: 'Senha:', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirmar Senha:', exact: true });
        this.registerButton = page.getByRole('button', { name: /registrar/i });
    }

    async goto() {
        await this.page.goto('/registro.html');
    }

    async fillForm({ nome, email, senha, confirmarSenha }) {
        await this.nameInput.fill(nome);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(senha);
        await this.confirmPasswordInput.fill(confirmarSenha);
    }

    async submit() {
        await this.registerButton.click();
    }

    async expectOnRegisterPage() {
        await expect(this.page).toHaveURL(/registro\.html/);
    }
}