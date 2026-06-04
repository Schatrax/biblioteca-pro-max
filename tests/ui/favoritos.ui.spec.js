import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { DetalhesPage } from '../../pages/DetalhesPage';
import { FavoritosPage } from '../../pages/FavoritosPage';

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
        nome: `Livro Favorito UI ${timestamp}`,
        autor: 'Autor Favorito UI',
        paginas: 180,
        descricao: 'Livro criado para teste de favoritos pela UI',
        imagemUrl: 'https://exemplo.com/favorito-ui.jpg',
        estoque: 5,
        preco: 29.9,
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

    console.log('Livro criado via API para favoritos:', body);

    return body;
}

test.describe('Favoritos UI', () => {
    test('CT-FE-013 - Adicionar livro aos favoritos pela UI', async ({ page, request }) => {
        await loginAs(page, users.admin);

        const book = await createBookByApi(request);
        const detalhesPage = new DetalhesPage(page);
        const favoritosPage = new FavoritosPage(page);

        await detalhesPage.goto(book.id);

        page.once('dialog', async dialog => {
            console.log('Add favorite alert:', dialog.message());
            expect(dialog.message()).toMatch(/favorito|favoritos|adicionado/i);
            await dialog.accept();
        });

        await detalhesPage.addToFavorites();

        await detalhesPage.expectRemoveFavoriteButtonVisible();

        await favoritosPage.goto();
        await favoritosPage.expectFavoriteBookVisible(book);

        console.log('Livro adicionado aos favoritos e visível na página Favoritos');
    });

    test('CT-FE-014 - Remover livro dos favoritos', async ({ page, request }) => {
        await loginAs(page, users.admin);

        const book = await createBookByApi(request);
        const detalhesPage = new DetalhesPage(page);
        const favoritosPage = new FavoritosPage(page);

        await detalhesPage.goto(book.id);

        page.once('dialog', async dialog => {
            console.log('Initial add favorite alert:', dialog.message());
            await dialog.accept();
        });

        await detalhesPage.addToFavorites();
        await detalhesPage.expectRemoveFavoriteButtonVisible();

        page.once('dialog', async dialog => {
            console.log('Remove favorite alert:', dialog.message());
            expect(dialog.message()).toMatch(/removido|favoritos|favorito/i);
            await dialog.accept();
        });

        await detalhesPage.removeFromFavorites();

        await detalhesPage.expectAddFavoriteButtonVisible();

        await favoritosPage.goto();
        await favoritosPage.expectFavoriteBookNotVisible(book);

        console.log('Livro removido dos favoritos com sucesso');
    });

    test('CT-FE-015 - Listar livros favoritos', async ({ page, request }) => {
        await loginAs(page, users.admin);

        const book = await createBookByApi(request);
        const detalhesPage = new DetalhesPage(page);
        const favoritosPage = new FavoritosPage(page);

        await detalhesPage.goto(book.id);

        page.once('dialog', async dialog => {
            console.log('Add favorite before list alert:', dialog.message());
            await dialog.accept();
        });

        await detalhesPage.addToFavorites();
        await detalhesPage.expectRemoveFavoriteButtonVisible();

        await favoritosPage.goto();

        await favoritosPage.expectFavoriteBookVisible(book);
        await favoritosPage.expectEmptyMessageOrFavoritesGrid();

        console.log('Página de favoritos listou o livro favoritado');
    });
});