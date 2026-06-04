import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';

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

test.describe('Navigation UI', () => {
    test('CT-FE-006 - Menu Dinâmico - Aluno', async ({ page }) => {
        await loginAs(page, users.aluno);

        await page.goto('/dashboard.html');

        await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /^livros$/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /favoritos/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /meus arrendamentos/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /^compras$/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /minhas compras/i })).toBeVisible();

        await page.getByRole('link', { name: /^livros$/i }).click();
        await expect(page).toHaveURL(/livros\.html/);
        console.log('Aluno navigated to Livros:', page.url());

        await page.getByRole('link', { name: /favoritos/i }).click();
        await expect(page).toHaveURL(/favoritos\.html/);
        console.log('Aluno navigated to Favoritos:', page.url());

        await page.getByRole('link', { name: /meus arrendamentos/i }).click();
        await expect(page).toHaveURL(/arrendamentos\.html/);
        console.log('Aluno navigated to Meus Arrendamentos:', page.url());

        await page.getByRole('link', { name: /^compras$/i }).click();
        await expect(page).toHaveURL(/compras\.html/);
        console.log('Aluno navigated to Compras:', page.url());

        await page.getByRole('link', { name: /minhas compras/i }).click();
        await expect(page).toHaveURL(/minhas-compras\.html/);
        console.log('Aluno navigated to Minhas Compras:', page.url());
    });

    test('CT-FE-007 - Menu Dinâmico - Admin', async ({ page }) => {
        await loginAs(page, users.admin);

        await page.goto('/dashboard.html');

        await expect(page.getByRole('link', { name: /dashboard/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /^livros$/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /favoritos/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /meus arrendamentos/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /aprovações|aprovacoes/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /compras admin/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /usuários \(admin\)|usuarios \(admin\)/i })).toBeVisible();

        await page.getByRole('link', { name: /aprovações|aprovacoes/i }).click();
        await expect(page).toHaveURL(/aprovacoes\.html/);
        console.log('Admin navigated to Aprovações:', page.url());

        await page.goto('/dashboard.html');

        await page.getByRole('link', { name: /compras admin/i }).click();
        await expect(page).toHaveURL(/compras-admin\.html/);
        console.log('Admin navigated to Compras Admin:', page.url());

        await page.goto('/dashboard.html');

        await page.getByRole('link', { name: /usuários \(admin\)|usuarios \(admin\)/i }).click();
        await expect(page).toHaveURL(/admin-usuarios\.html/);
        console.log('Admin navigated to Admin Usuários:', page.url());
    });
});