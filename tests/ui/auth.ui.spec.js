import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';

test.describe('Auth UI', () => {
    test('CT-FE-001 - Fluxo completo de registro de aluno', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const timestamp = Date.now();

        const novoAluno = {
            nome: `Carlos Oliveira ${timestamp}`,
            email: `carlos.oliveira.${timestamp}@teste.com`,
            senha: 'senha123',
            confirmarSenha: 'senha123'
        };

        await registerPage.goto();

        await registerPage.fillForm(novoAluno);

        page.once('dialog', async dialog => {
            console.log('Register alert:', dialog.message());
            expect(dialog.message()).toContain('Cadastro realizado com sucesso! Faça login.');
            await dialog.accept();
        });

        await registerPage.submit();

        await expect(page).toHaveURL(/login\.html/);

        console.log('Registro concluído e redirecionado para login:', page.url());
    });

    test('CT-FE-002 - Validação de senhas não correspondentes', async ({ page }) => {
        const registerPage = new RegisterPage(page);
        const timestamp = Date.now();

        await registerPage.goto();

        await registerPage.fillForm({
            nome: `Carlos Oliveira ${timestamp}`,
            email: `carlos.senhas.${timestamp}@teste.com`,
            senha: 'senha123',
            confirmarSenha: 'senha456'
        });

        page.once('dialog', async dialog => {
            console.log('Password mismatch alert:', dialog.message());
            expect(dialog.message()).toContain('As senhas não conferem');
            await dialog.accept();
        });

        await registerPage.submit();

        await registerPage.expectOnRegisterPage();

        console.log('Usuário permaneceu na página de registro após senhas diferentes');
    });

    test('CT-FE-003 - Login com sucesso como admin', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        page.once('dialog', async dialog => {
            console.log('Login success alert:', dialog.message());
            expect(dialog.message()).toContain('Login realizado com sucesso');
            await dialog.accept();
        });

        await loginPage.login(users.admin.email, users.admin.senha);

        await expect(page).toHaveURL(/dashboard\.html/);

        const storageData = await page.evaluate(() => {
            const usuario = localStorage.getItem('usuario');
            return usuario ? JSON.parse(usuario) : null;
        });

        console.log('LocalStorage usuario:', storageData);

        expect(storageData).toBeTruthy();
        expect(storageData.email).toBe(users.admin.email);
        expect(storageData.tipo).toBe(users.admin.tipo);
        expect(storageData.senha).toBeUndefined();
    });

    test('CT-FE-004 - Login com credenciais inválidas', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goto();

        page.once('dialog', async dialog => {
            console.log('Invalid login alert:', dialog.message());
            expect(dialog.message()).toMatch(/erro|incorretos|inválid/i);
            await dialog.accept();
        });

        await loginPage.login(users.admin.email, 'errada');

        await loginPage.expectOnLoginPage();

        await expect(loginPage.emailInput).toHaveValue(users.admin.email);

        console.log('Login inválido manteve utilizador na página de login');
    });

    test('CT-FE-005 - Proteção de rotas sem login', async ({ page }) => {
        await page.goto('/login.html');
        await page.evaluate(() => localStorage.clear());

        await page.goto('/dashboard.html');

        console.log('URL após tentar aceder dashboard sem login:', page.url());

        await expect(page).toHaveURL(/login\.html/);
    });
});