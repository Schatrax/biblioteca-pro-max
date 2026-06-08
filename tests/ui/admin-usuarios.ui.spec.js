import { test, expect } from '@playwright/test';

import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { AdminUsuariosPage } from '../../pages/AdminUsuariosPage';

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

async function createUserByApi(request, overrides = {}) {
    const timestamp = Date.now();

    const payload = {
        nome: `User UI ${timestamp}`,
        email: `user.ui.${timestamp}@teste.com`,
        senha: '123456',
        ...overrides
    };

    const response = await request.post('/registro', {
        data: payload
    });

    const body = await response.json();

    console.log('User created by API:', body);

    expect(response.status()).toBe(201);

    return body.usuario;
}

test.describe('Admin Usuários UI', () => {
    test('CT-FE-020 - Acessar tela de usuários como admin e bloquear não-admin', async ({ page, context }) => {
        await loginAs(page, users.admin);

        await page.getByRole('link', { name: /usuários \(admin\)|usuarios \(admin\)/i }).click();

        const adminUsuariosPage = new AdminUsuariosPage(page);
        await adminUsuariosPage.expectAdminPageVisible();

        console.log('Admin users page opened successfully');

        const studentPage = await context.newPage();

        await loginAs(studentPage, users.aluno);

        await studentPage.goto('/admin-usuarios.html');

        const bodyText = await studentPage.locator('body').innerText();

        console.log('Non-admin access body:', bodyText);

        expect(bodyText).toMatch(/acesso|negado|não autorizado|nao autorizado|admin/i);

        await studentPage.close();
    });

    test('CT-FE-021 - Criar funcionário pela UI Admin', async ({ page }) => {
        await loginAs(page, users.admin);

        const adminUsuariosPage = new AdminUsuariosPage(page);

        const timestamp = Date.now();

        const newUser = {
            nome: `Novo Func ${timestamp}`,
            email: `novo.func.${timestamp}@teste.com`,
            senha: '123456',
            tipo: 2
        };

        await adminUsuariosPage.goto();

        page.once('dialog', async dialog => {
            console.log('Create user alert:', dialog.message());
            expect(dialog.message()).toMatch(/sucesso|criado|usuário|usuario/i);
            await dialog.accept();
        });

        await adminUsuariosPage.createUser(newUser);

        await adminUsuariosPage.expectUserVisible(newUser.email);

        console.log('Funcionário criado pela UI:', newUser.email);
    });

    test('CT-FE-022 - Editar usuário na tabela', async ({ page }) => {
        await loginAs(page, users.admin);

        const adminUsuariosPage = new AdminUsuariosPage(page);

        await adminUsuariosPage.goto();

        const timestamp = Date.now();

        const newUser = {
            nome: `User Edit ${timestamp}`,
            email: `user.edit.${timestamp}@teste.com`,
            senha: '123456',
            tipo: 2
        };

        page.once('dialog', async dialog => {
            console.log('Create user before edit alert:', dialog.message());
            await dialog.accept();
        });

        await adminUsuariosPage.createUser(newUser);
        await adminUsuariosPage.expectUserVisible(newUser.email);

        const updatedUser = {
            nome: `User Editado ${timestamp}`,
            email: `user.editado.${timestamp}@teste.com`
        };

        page.once('dialog', async dialog => {
            console.log('Edit user alert:', dialog.message());
            await dialog.accept();
        });

        await adminUsuariosPage.editUserEmail({
            currentEmail: newUser.email,
            newName: updatedUser.nome,
            newEmail: updatedUser.email
        });

        await adminUsuariosPage.expectUserVisible(updatedUser.email);

        console.log('Usuário editado pela UI:', updatedUser.email);
    });

    test('CT-FE-023 - Excluir usuário', async ({ page, request }) => {
        const createdUser = await createUserByApi(request);

        await loginAs(page, users.admin);

        const adminUsuariosPage = new AdminUsuariosPage(page);

        await adminUsuariosPage.goto();

        page.once('dialog', async dialog => {
            console.log('Delete user confirm:', dialog.message());
            await dialog.accept();
        });

        await adminUsuariosPage.deleteUser(createdUser.email);

        await adminUsuariosPage.expectUserNotVisible(createdUser.email);

        console.log('Usuário excluído pela UI:', createdUser.email);
    });
});