import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';

async function loginAs(page, user) {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    page.once('dialog', async dialog => {
        console.log('Login alert:', dialog.message());
        await dialog.accept();
    });

    await loginPage.login(user.email, user.senha);

    await expect(page).toHaveURL(/dashboard\.html/);
}

test.describe('Dashboard UI', () => {
    test('CT-FE-008 - Dashboard visão admin', async ({ page }) => {
        await loginAs(page, users.admin);

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        await dashboardPage.expectAdminStatsVisible();

        const bodyText = await dashboardPage.getVisibleText();
        console.log('Dashboard visible text:', bodyText);

        expect(bodyText).toMatch(/Total de Livros\s+\d+/);
        expect(bodyText).toMatch(/Total de Usuários\s+\d+/);
        expect(bodyText).toMatch(/Livros Disponíveis\s+\d+/);
        expect(bodyText).toMatch(/Alunos\s+\d+/);
        expect(bodyText).toMatch(/Funcionários\s+\d+/);
        expect(bodyText).toMatch(/Administradores\s+\d+/);
    });

    test('CT-FE-009 - Dashboard visão aluno', async ({ page }) => {
        await loginAs(page, users.aluno);

        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();

        await dashboardPage.expectStudentStatsVisible();

        const bodyText = await dashboardPage.getVisibleText();
        console.log('Dashboard aluno visible text:', bodyText);

        await expect(page.locator('body')).toContainText(/livros/i);
    });
});