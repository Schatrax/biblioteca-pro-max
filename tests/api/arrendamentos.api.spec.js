import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';

function createBookPayload(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Livro Arrendamento ${timestamp}`,
    autor: 'Autor Arrendamento',
    paginas: 200,
    descricao: 'Livro criado para testes de arrendamento',
    imagemUrl: 'https://exemplo.com/arrendamento.jpg',
    estoque: 5,
    preco: 25.9,
    ...overrides
  };
}

async function createBook(request, overrides = {}) {
  const payload = createBookPayload(overrides);

  const response = await request.post('/livros', {
    data: payload
  });

  const body = await response.json();

  console.log('Livro criado para arrendamento:', body);

  expect(response.status()).toBe(201);

  return body;
}

async function createRental(request, { usuarioId, livroId, dataInicio, dataFim }) {
  const response = await request.post('/arrendamentos', {
    data: {
      usuarioId,
      livroId,
      dataInicio,
      dataFim
    }
  });

  const body = await response.json();

  console.log('Arrendamento criado:', body);

  return { response, body };
}

test.describe('Arrendamentos API', () => {
  const alunoId = 3;

  test('CT-API-018 - Criar arrendamento válido', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 3
    });

    const { response, body } = await createRental(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      dataInicio: '2026-12-20',
      dataFim: '2026-12-27'
    });

    console.log('POST /arrendamentos status:', response.status());
    console.log('POST /arrendamentos body:', body);

    expect(response.status()).toBe(201);
    expect(body.id).toBeGreaterThan(0);
    expect(body.usuarioId).toBe(alunoId);
    expect(body.livroId).toBe(livro.id);
    expect(body.status).toBe('PENDENTE');
    expect(body.criadoEm).toBeTruthy();
  });

  test('CT-API-019 - Criar arrendamento sem estoque', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 0
    });

    const { response, body } = await createRental(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      dataInicio: '2026-12-20',
      dataFim: '2026-12-27'
    });

    console.log('POST /arrendamentos sem estoque status:', response.status());
    console.log('POST /arrendamentos sem estoque body:', body);

    expect(response.status()).toBe(400);
    expect(body.mensagem).toBe('Livro sem estoque para arrendamento');
  });

  test('CT-API-020 - Atualizar status de arrendamento para APROVADO', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 5
    });

    const { response: createRentalResponse, body: rental } = await createRental(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      dataInicio: '2026-12-20',
      dataFim: '2026-12-27'
    });

    expect(createRentalResponse.status()).toBe(201);

    const bookBeforeResponse = await request.get(`/livros/${livro.id}`);
    const bookBefore = await bookBeforeResponse.json();

    console.log('Livro antes da aprovação:', bookBefore);

    const updateResponse = await request.put(`/arrendamentos/${rental.id}/status`, {
      data: {
        status: 'APROVADO'
      }
    });

    const updatedRental = await updateResponse.json();

    console.log('PUT /arrendamentos/:id/status status:', updateResponse.status());
    console.log('PUT /arrendamentos/:id/status body:', updatedRental);

    expect(updateResponse.status()).toBe(200);
    expect(updatedRental.status).toBe('APROVADO');

    const bookAfterResponse = await request.get(`/livros/${livro.id}`);
    const bookAfter = await bookAfterResponse.json();

    console.log('Livro depois da aprovação:', bookAfter);

    expect(bookAfter.estoque).toBe(bookBefore.estoque - 1);
  });

  test('CT-API-021 - Atualizar status com valor inválido', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 5
    });

    const { response: createRentalResponse, body: rental } = await createRental(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      dataInicio: '2026-12-20',
      dataFim: '2026-12-27'
    });

    expect(createRentalResponse.status()).toBe(201);

    const updateResponse = await request.put(`/arrendamentos/${rental.id}/status`, {
      data: {
        status: 'EM_ANALISE'
      }
    });

    const body = await updateResponse.json();

    console.log('PUT /arrendamentos invalid status:', updateResponse.status());
    console.log('PUT /arrendamentos invalid body:', body);

    expect(updateResponse.status()).toBe(400);
    expect(body.mensagem).toBe('Status inválido');
  });

  test('CT-API-022 - Listar arrendamentos do usuário', async ({ request }) => {
    const livro = await createBook(request, {
      estoque: 5
    });

    const { response: createRentalResponse } = await createRental(request, {
      usuarioId: alunoId,
      livroId: livro.id,
      dataInicio: '2026-12-20',
      dataFim: '2026-12-27'
    });

    expect(createRentalResponse.status()).toBe(201);

    const response = await request.get(`/arrendamentos/me?usuarioId=${alunoId}`);
    const body = await response.json();

    console.log('GET /arrendamentos/me status:', response.status());
    console.log('GET /arrendamentos/me body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const arrendamento of body) {
      expect(arrendamento.usuarioId).toBe(alunoId);
    }
  });
});