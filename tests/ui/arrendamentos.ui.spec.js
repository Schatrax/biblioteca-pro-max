import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';
import { LoginPage } from '../../pages/LoginPage';
import { ArrendamentosPage } from '../../pages/ArrendamentosPage';
import { AprovacoesPage } from '../../pages/AprovacoesPage';

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

function getFutureDates() {
  const start = new Date();
  start.setDate(start.getDate() + 1);

  const end = new Date();
  end.setDate(end.getDate() + 8);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

function createBookPayload(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Livro Arrendamento UI ${timestamp}`,
    autor: 'Autor Arrendamento UI',
    paginas: 200,
    descricao: 'Livro criado para teste UI de arrendamento',
    imagemUrl: 'https://exemplo.com/arrendamento-ui.jpg',
    estoque: 5,
    preco: 25.9,
    ...overrides
  };
}

async function createBookByApi(request, overrides = {}) {
  const response = await request.post('/livros', {
    data: createBookPayload(overrides)
  });

  expect(response.status()).toBe(201);

  const body = await response.json();

  console.log('Livro criado para arrendamento UI:', body);

  return body;
}

async function createRentalByApi(request, { usuarioId, livroId }) {
  const { startDate, endDate } = getFutureDates();

  const response = await request.post('/arrendamentos', {
    data: {
      usuarioId,
      livroId,
      dataInicio: startDate,
      dataFim: endDate
    }
  });

  const body = await response.json();

  console.log('Arrendamento criado via API:', body);

  expect(response.status()).toBe(201);

  return body;
}

test.describe('Arrendamentos UI', () => {
  test('CT-FE-016 - Solicitar novo arrendamento', async ({ page, request }) => {
    await loginAs(page, users.aluno);

    const book = await createBookByApi(request, { estoque: 5 });
    const { startDate, endDate } = getFutureDates();

    const arrendamentosPage = new ArrendamentosPage(page);

    await arrendamentosPage.goto();

    page.once('dialog', async dialog => {
      console.log('Rental request alert:', dialog.message());
      expect(dialog.message()).toMatch(/sucesso|arrendamento|solicitado/i);
      await dialog.accept();
    });

    await arrendamentosPage.requestRental({
      bookId: book.id,
      startDate,
      endDate
    });

    await arrendamentosPage.expectRentalVisible(book.nome);

    console.log('Arrendamento solicitado com sucesso pela UI:', book.nome);
  });

  test('CT-FE-017 - Aprovar arrendamento', async ({ page, request }) => {
    const book = await createBookByApi(request, { estoque: 5 });

    await createRentalByApi(request, {
      usuarioId: users.aluno.id || 3,
      livroId: book.id
    });

    await loginAs(page, users.funcionario);

    const aprovacoesPage = new AprovacoesPage(page);

    await aprovacoesPage.goto();

    page.once('dialog', async dialog => {
      console.log('Approve rental dialog:', dialog.message());
      await dialog.accept();
    });

    await aprovacoesPage.approveFirstPendingRental();

    await aprovacoesPage.expectApprovedStatusVisible();

    console.log('Arrendamento aprovado com sucesso pela UI');
  });
});