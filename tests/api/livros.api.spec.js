import { test, expect } from '@playwright/test';

function createBookPayload(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Livro Teste ${timestamp}`,
    autor: 'Autor Teste',
    paginas: 250,
    descricao: 'Descrição criada para teste automatizado',
    imagemUrl: 'https://exemplo.com/imagem.jpg',
    estoque: 5,
    preco: 39.9,
    ...overrides
  };
}

test.describe('Livros API', () => {
  test('CT-API-005 - Listar todos os livros', async ({ request }) => {
    const response = await request.get('/livros');
    const body = await response.json();

    console.log('GET /livros status:', response.status());
    console.log('GET /livros body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const livro of body) {
      expect(livro).toHaveProperty('id');
      expect(livro).toHaveProperty('nome');
      expect(livro).toHaveProperty('autor');
      expect(livro).toHaveProperty('paginas');
      expect(livro).toHaveProperty('descricao');
      expect(livro).toHaveProperty('imagemUrl');
      expect(livro).toHaveProperty('dataCadastro');
      expect(livro).toHaveProperty('estoque');
      expect(livro).toHaveProperty('preco');

      expect(Number.isInteger(livro.paginas)).toBe(true);
      expect(livro.paginas).toBeGreaterThan(0);
      expect(new Date(livro.dataCadastro).toString()).not.toBe('Invalid Date');
    }
  });

  test('CT-API-006 - Listar livros disponíveis', async ({ request }) => {
    const response = await request.get('/livros/disponiveis');
    const body = await response.json();

    console.log('GET /livros/disponiveis status:', response.status());
    console.log('GET /livros/disponiveis body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const livro of body) {
      expect(livro.estoque).toBeGreaterThan(0);

      if (livro.disponivel !== undefined) {
        expect(livro.disponivel).toBe(true);
      }
    }
  });

  test('CT-API-007 - Buscar livro por ID existente', async ({ request }) => {
    const payload = createBookPayload();

    const createResponse = await request.post('/livros', { data: payload });
    expect(createResponse.status()).toBe(201);

    const createdBook = await createResponse.json();

    const response = await request.get(`/livros/${createdBook.id}`);
    const body = await response.json();

    console.log('GET /livros/:id status:', response.status());
    console.log('GET /livros/:id body:', body);

    expect(response.status()).toBe(200);
    expect(body.id).toBe(createdBook.id);
    expect(body.nome).toBeTruthy();
    expect(body.autor).toBeTruthy();
    expect(body.paginas).toBeGreaterThan(0);
  });

  test('CT-API-008 - Buscar livro por ID inexistente', async ({ request }) => {
    const response = await request.get('/livros/9999');
    const body = await response.json();

    console.log('GET /livros/9999 status:', response.status());
    console.log('GET /livros/9999 body:', body);

    expect(response.status()).toBe(404);
    expect(body.mensagem).toBe('Livro não encontrado');
  });

  test('CT-API-009 - Adicionar novo livro', async ({ request }) => {
    const payload = createBookPayload({
      nome: `Código Limpo ${Date.now()}`,
      autor: 'Robert C. Martin',
      paginas: 425,
      descricao: 'Manual de boas práticas',
      imagemUrl: 'https://exemplo.com/imagem.jpg',
      estoque: 10,
      preco: 59.9
    });

    const response = await request.post('/livros', { data: payload });
    const body = await response.json();

    console.log('POST /livros status:', response.status());
    console.log('POST /livros body:', body);

    expect(response.status()).toBe(201);
    expect(body.id).toBeGreaterThan(0);
    expect(body.nome).toBe(payload.nome);
    expect(body.autor).toBe(payload.autor);
    expect(body.paginas).toBe(payload.paginas);
    expect(body.descricao).toBe(payload.descricao);
    expect(body.imagemUrl).toBe(payload.imagemUrl);
    expect(body.estoque).toBe(payload.estoque);
    expect(body.preco).toBe(payload.preco);
    expect(body.dataCadastro).toBeTruthy();
    expect(new Date(body.dataCadastro).toString()).not.toBe('Invalid Date');
  });

  test('CT-API-010 - Adicionar livro sem campos obrigatórios', async ({ request }) => {
    const payload = {
      nome: '',
      autor: '',
      paginas: null
    };

    const response = await request.post('/livros', { data: payload });
    const body = await response.json();

    console.log('POST /livros invalid status:', response.status());
    console.log('POST /livros invalid body:', body);

    expect(response.status()).toBe(400);
    expect(body.mensagem).toBeTruthy();
  });

  test('CT-API-011 - Atualizar livro existente', async ({ request }) => {
    const createPayload = createBookPayload({
      nome: `Livro para Update ${Date.now()}`
    });

    const createResponse = await request.post('/livros', { data: createPayload });
    expect(createResponse.status()).toBe(201);

    const createdBook = await createResponse.json();

    const updatePayload = {
      nome: 'Clean Code - Edição Atualizada',
      autor: 'Robert C. Martin',
      paginas: 464,
      descricao: 'Guia completo atualizado',
      imagemUrl: 'https://exemplo.com/nova-imagem.jpg',
      estoque: 7,
      preco: 79.9
    };

    const updateResponse = await request.put(`/livros/${createdBook.id}`, {
      data: updatePayload
    });

    const updatedBook = await updateResponse.json();

    console.log('PUT /livros/:id status:', updateResponse.status());
    console.log('PUT /livros/:id body:', updatedBook);

    expect(updateResponse.status()).toBe(200);
    expect(updatedBook.id).toBe(createdBook.id);
    expect(updatedBook.nome).toBe(updatePayload.nome);
    expect(updatedBook.autor).toBe(updatePayload.autor);
    expect(updatedBook.paginas).toBe(updatePayload.paginas);
    expect(updatedBook.descricao).toBe(updatePayload.descricao);
    expect(updatedBook.imagemUrl).toBe(updatePayload.imagemUrl);
    expect(updatedBook.estoque).toBe(updatePayload.estoque);
    expect(updatedBook.preco).toBe(updatePayload.preco);
  });

  test('CT-API-012 - Eliminar livro', async ({ request }) => {
    const payload = createBookPayload({
      nome: `Livro para Delete ${Date.now()}`
    });

    const createResponse = await request.post('/livros', { data: payload });
    expect(createResponse.status()).toBe(201);

    const createdBook = await createResponse.json();

    const deleteResponse = await request.delete(`/livros/${createdBook.id}`);
    const deleteBody = await deleteResponse.json();

    console.log('DELETE /livros/:id status:', deleteResponse.status());
    console.log('DELETE /livros/:id body:', deleteBody);

    expect(deleteResponse.status()).toBe(200);
    expect(deleteBody.mensagem).toContain('Livro removido');

    const getDeletedResponse = await request.get(`/livros/${createdBook.id}`);
    const getDeletedBody = await getDeletedResponse.json();

    console.log('GET deleted book status:', getDeletedResponse.status());
    console.log('GET deleted book body:', getDeletedBody);

    expect(getDeletedResponse.status()).toBe(404);
  });
});