import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';

test('CT-FE-024 - Logout do sistema', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        page.once('dialog', async dialog => {
            console.log('Login alert before logout:', dialog.message());
            await dialog.accept();
        });

        await loginPage.login(users.admin.email, users.admin.senha);

        await expect(page).toHaveURL(/dashboard\.html/);

        await page.getByRole('button', { name: /sair/i }).click();

        await expect(page).toHaveURL(/login\.html/);

        const storageData = await page.evaluate(() => ({
            usuario: localStorage.getItem('usuario'),
            usuarioLogado: localStorage.getItem('usuarioLogado')
        }));

        console.log('LocalStorage after logout:', storageData);

        expect(storageData.usuario).toBeNull();
    });