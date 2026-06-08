import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { ComprasPage } from '../../pages/ComprasPage';
import { ComprasAdminPage } from '../../pages/ComprasAdminPage';

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
        nome: `Livro Compra UI ${timestamp}`,
        autor: 'Autor Compra UI',
        paginas: 250,
        descricao: 'Livro criado para testes UI de compras',
        imagemUrl: 'https://exemplo.com/compra-ui.jpg',
        estoque: 10,
        preco: 50,
        ...overrides
    };
}

async function createBookByApi(request, overrides = {}) {
    const response = await request.post('/livros', {
        data: createBookPayload(overrides)
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    console.log('Book created for purchase UI:', body);

    return body;
}

async function createPurchaseByApi(request, { usuarioId, livroId }) {
    const response = await request.post('/compras', {
        data: {
            usuarioId,
            livroId,
            quantidade: 1
        }
    });

    expect(response.status()).toBe(201);

    const body = await response.json();

    console.log('Purchase created via API:', body);

    return body;
}

test.describe('Compras UI', () => {
    test('CT-FE-018 - Registrar compra', async ({ page, request }) => {
        await loginAs(page, users.aluno);

        const book = await createBookByApi(request);

        const comprasPage = new ComprasPage(page);

        await comprasPage.goto();

        page.once('dialog', async dialog => {
            console.log('Purchase alert:', dialog.message());
            await dialog.accept();
        });

        const purchaseResponsePromise = page.waitForResponse(response =>
            response.url().includes('/compras') &&
            response.request().method() === 'POST'
        );

        await comprasPage.createPurchase({
            bookId: book.id,
            bookName: book.nome,
            quantity: 1
        });

        const purchaseResponse = await purchaseResponsePromise;
        const purchaseBody = await purchaseResponse.json();

        console.log('POST /compras from UI status:', purchaseResponse.status());
        console.log('POST /compras from UI body:', purchaseBody);

        expect(purchaseResponse.status()).toBe(201);
        expect(purchaseBody.livroId).toBe(book.id);
        expect(purchaseBody.usuarioId).toBe(users.aluno.id || 3);
        expect(purchaseBody.quantidade).toBe(1);
        expect(purchaseBody.status).toBe('PENDENTE');

        console.log('Purchase successfully created via UI');
    });

    test('CT-FE-019 - Aprovar compra', async ({ page, request }) => {
        const book = await createBookByApi(request);

        await createPurchaseByApi(request, {
            usuarioId: users.aluno.id || 3,
            livroId: book.id
        });

        await loginAs(page, users.admin);

        const comprasAdminPage = new ComprasAdminPage(page);

        await comprasAdminPage.goto();

        page.once('dialog', async dialog => {
            console.log('Approve purchase dialog:', dialog.message());
            await dialog.accept();
        });

        await comprasAdminPage.approveFirstPendingPurchase();

        await comprasAdminPage.expectApprovedPurchaseVisible();

        console.log('Purchase approved successfully');
    });
});