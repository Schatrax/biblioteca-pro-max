import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { LivrosPage } from '../../pages/LivrosPage';
import { DetalhesPage } from '../../pages/DetalhesPage';

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

function createBookPayload(overrides = {}) {
    const timestamp = Date.now();

    return {
        nome: `Livro UI ${timestamp}`,
        autor: 'Autor UI',
        paginas: 310,
        descricao: 'Descrição criada para teste de UI',
        imagemUrl: 'https://exemplo.com/livro-ui.jpg',
        estoque: 5,
        preco: 39.9,
        ...overrides
    };
}

async function createBookByApi(request, overrides = {}) {
    const payload = createBookPayload(overrides);

    const response = await request.post('/livros', {
        data: payload
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    console.log('Livro criado via API:', body);

    return body;
}

test.describe('Livros UI', () => {
    test('CT-FE-010 - Cadastro de livro via UI', async ({ page }) => {
        await loginAs(page, users.admin);

        const livrosPage = new LivrosPage(page);
        const livro = createBookPayload({
            nome: `O Hobbit ${Date.now()}`,
            autor: 'J.R.R. Tolkien',
            paginas: 310,
            descricao: 'Livro clássico de fantasia',
            imagemUrl: 'https://exemplo.com/hobbit.jpg',
            estoque: 5,
            preco: 39.9
        });

        await livrosPage.goto();

        await livrosPage.fillBookForm(livro);

        page.once('dialog', async dialog => {
            console.log('Add book alert:', dialog.message());
            expect(dialog.message()).toContain('Livro adicionado com sucesso');
            await dialog.accept();
        });

        await livrosPage.submitBook();

        await livrosPage.expectFormCleared();
        await livrosPage.expectBookVisible(livro.nome);

        console.log('Livro criado pela UI com sucesso:', livro.nome);
    });

    test('CT-FE-011 - Validação de campos obrigatórios no livro', async ({ page }) => {
        await loginAs(page, users.admin);

        const livrosPage = new LivrosPage(page);

        await livrosPage.goto();

        await livrosPage.submitBook();

        await livrosPage.expectRequiredValidationOnName();

        console.log('Validação HTML5 de campo obrigatório confirmada');
    });

    test('CT-FE-012 - Visualizar detalhes de livro', async ({ page, request }) => {
        await loginAs(page, users.admin);

        const createdBook = await createBookByApi(request);

        const detalhesPage = new DetalhesPage(page);

        await detalhesPage.goto(createdBook.id);
        await detalhesPage.expectOnDetailsPage(createdBook.id);
        await detalhesPage.expectBookDetailsVisible(createdBook);

        console.log('Detalhes do livro validados com sucesso:', createdBook);
    });
});