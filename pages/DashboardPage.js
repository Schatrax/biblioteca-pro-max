import { expect } from '@playwright/test';

export class DashboardPage {
    constructor(page) {
        this.page = page;

        this.statsSection = page.locator('#stats');

        this.totalLivrosText = this.statsSection.getByRole('heading', {
            name: 'Total de Livros'
        });

        this.totalUsuariosText = this.statsSection.getByRole('heading', {
            name: 'Total de Usuários'
        });

        this.livrosDisponiveisText = this.statsSection.getByRole('heading', {
            name: 'Livros Disponíveis'
        });

        this.ultimosLivrosHeading = page.getByRole('heading', {
            name: /livros disponíveis|últimos livros|livros recentes/i
        });
    }

    async goto() {
        await this.page.goto('/dashboard.html');
    }

    async expectOnDashboardPage() {
        await expect(this.page).toHaveURL(/dashboard\.html/);
    }

    async expectAdminStatsVisible() {
        await expect(this.totalLivrosText).toBeVisible();
        await expect(this.totalUsuariosText).toBeVisible();
        await expect(this.livrosDisponiveisText).toBeVisible();

        await expect(this.page.locator('body')).toContainText(/alunos/i);
        await expect(this.page.locator('body')).toContainText(/funcionários|funcionarios/i);
        await expect(this.page.locator('body')).toContainText(/administradores|admins/i);
    }

    async expectStudentStatsVisible() {
        await expect(this.totalLivrosText).toBeVisible();
        await expect(this.livrosDisponiveisText).toBeVisible();

        await expect(this.page.locator('body')).toContainText(/alunos/i);
    }

    async getVisibleText() {
        return await this.page.locator('body').innerText();
    }
}