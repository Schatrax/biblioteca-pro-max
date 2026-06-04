import { test, expect } from '@playwright/test';

function createBookPayload(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Livro Compra ${timestamp}`,
    autor: 'Autor Compra',
    paginas: 220,
    descricao: 'Livro criado para testes de compras',
    imagemUrl: 'https://exemplo.com/compra.jpg',
    estoque: 10,
    preco: 50,
    ...overrides
  };
}

async function createBook(request, overrides = {}) {
  const payload = createBookPayload(overrides);

  const response = await request.post('/livros', {
    data: payload
  });

  const body = await response.json();

  console.log('Livro criado para compra:', body);

  expect(response.status()).toBe(201);

  return body;
}

async function createPurchase(request, { usuarioId, livroId, quantidade }) {
  const response = await request.post('/compras', {
    data: {
      usuarioId,
      livroId,
      quantidade
    }
  });

  const body = await response.json();

  console.log('Compra criada:', body);

  return { response, body };
}

test.describe('Compras API', () => {
  const alunoId = 3;

  test('CT-API-023 - Criar compra com estoque suficiente', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 10,
      preco: 50
    });

    const quantidade = 2;

    const { response, body } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade
    });

    console.log('POST /compras status:', response.status());
    console.log('POST /compras body:', body);

    expect(response.status()).toBe(201);
    expect(body.id).toBeGreaterThan(0);
    expect(body.usuarioId).toBe(alunoId);
    expect(body.livroId).toBe(livro.id);
    expect(body.quantidade).toBe(quantidade);
    expect(body.status).toBe('PENDENTE');
    expect(body.total).toBe(livro.preco * quantidade);
  });

  test('CT-API-024 - Criar compra com estoque insuficiente', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 2,
      preco: 50
    });

    const { response, body } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade: 100
    });

    console.log('POST /compras estoque insuficiente status:', response.status());
    console.log('POST /compras estoque insuficiente body:', body);

    expect(response.status()).toBe(400);
    expect(body.mensagem).toBe('Estoque insuficiente');
  });

  test('CT-API-025 - Aprovar compra', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 10,
      preco: 50
    });

    const quantidade = 2;

    const { response: createPurchaseResponse, body: purchase } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade
    });

    expect(createPurchaseResponse.status()).toBe(201);

    const bookBeforeResponse = await request.get(`/livros/${livro.id}`);
    const bookBefore = await bookBeforeResponse.json();

    console.log('Livro antes da aprovação da compra:', bookBefore);

    const approveResponse = await request.put(`/compras/${purchase.id}/status`, {
      data: {
        status: 'APROVADA'
      }
    });

    const approvedPurchase = await approveResponse.json();

    console.log('PUT /compras/:id/status APROVADA status:', approveResponse.status());
    console.log('PUT /compras/:id/status APROVADA body:', approvedPurchase);

    expect(approveResponse.status()).toBe(200);
    expect(approvedPurchase.status).toBe('APROVADA');

    const bookAfterResponse = await request.get(`/livros/${livro.id}`);
    const bookAfter = await bookAfterResponse.json();

    console.log('Livro depois da aprovação da compra:', bookAfter);

    expect(bookAfter.estoque).toBe(bookBefore.estoque - quantidade);
  });

  test('CT-API-026 - Cancelar compra', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 10,
      preco: 50
    });

    const quantidade = 2;

    const { response: createPurchaseResponse, body: purchase } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade
    });

    expect(createPurchaseResponse.status()).toBe(201);

    const bookBeforeResponse = await request.get(`/livros/${livro.id}`);
    const bookBefore = await bookBeforeResponse.json();

    console.log('Livro antes do cancelamento da compra:', bookBefore);

    const cancelResponse = await request.put(`/compras/${purchase.id}/status`, {
      data: {
        status: 'CANCELADA'
      }
    });

    const canceledPurchase = await cancelResponse.json();

    console.log('PUT /compras/:id/status CANCELADA status:', cancelResponse.status());
    console.log('PUT /compras/:id/status CANCELADA body:', canceledPurchase);

    expect(cancelResponse.status()).toBe(200);
    expect(canceledPurchase.status).toBe('CANCELADA');

    const bookAfterResponse = await request.get(`/livros/${livro.id}`);
    const bookAfter = await bookAfterResponse.json();

    console.log('Livro depois do cancelamento da compra:', bookAfter);

    expect(bookAfter.estoque).toBe(bookBefore.estoque);
  });

  test('CT-API-027 - Listar compras do usuário', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 10,
      preco: 50
    });

    const { response: createPurchaseResponse } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade: 1
    });

    expect(createPurchaseResponse.status()).toBe(201);

    const response = await request.get(`/compras/me?usuarioId=${alunoId}`);
    const body = await response.json();

    console.log('GET /compras/me status:', response.status());
    console.log('GET /compras/me body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const compra of body) {
      expect(compra.usuarioId).toBe(alunoId);
    }
  });

  test('CT-API-028 - Listar todas as compras', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 10,
      preco: 50
    });

    const { response: createPurchaseResponse } = await createPurchase(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      quantidade: 1
    });

    expect(createPurchaseResponse.status()).toBe(201);

    const response = await request.get('/compras');
    const body = await response.json();

    console.log('GET /compras status:', response.status());
    console.log('GET /compras body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    expect(body.length).toBeGreaterThan(0);
  });
});