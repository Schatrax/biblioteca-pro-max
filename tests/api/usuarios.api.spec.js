import { test, expect } from '@playwright/test';

function createUserPayload(overrides = {}) {
  const timestamp = Date.now();

  return {
    nome: `Usuário Teste ${timestamp}`,
    email: `usuario.teste.${timestamp}@teste.com`,
    senha: '123456',
    tipo: 1,
    ...overrides
  };
}

async function createUser(request, overrides = {}) {
  const payload = createUserPayload(overrides);

  const response = await request.post('/registro', {
    data: payload
  });

  const body = await response.json();

  console.log('Usuário criado para teste:', body);

  expect(response.status()).toBe(201);

  return body.usuario;
}

test.describe('Usuários API', () => {
  test('CT-API-029 - Listar usuários', async ({ request }) => {
    const response = await request.get('/usuarios');
    const body = await response.json();

    console.log('GET /usuarios status:', response.status());
    console.log('GET /usuarios body:', body);

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBe(true);

    for (const usuario of body) {
      expect(usuario).toHaveProperty('id');
      expect(usuario).toHaveProperty('nome');
      expect(usuario).toHaveProperty('email');
      expect(usuario).toHaveProperty('tipo');
      expect(usuario.senha).toBeUndefined();
    }
  });

  test('CT-API-030 - Atualizar usuário', async ({ request }) => {
    const usuario = await createUser(request, {
      tipo: 1
    });

    const updatePayload = {
      nome: `Funcionário Atualizado ${Date.now()}`,
      email: `func.atualizado.${Date.now()}@biblio.com`,
      tipo: 2
    };

    const response = await request.put(`/usuarios/${usuario.id}`, {
      data: updatePayload
    });

    const body = await response.json();

    console.log('PUT /usuarios/:id status:', response.status());
    console.log('PUT /usuarios/:id body:', body);

    expect(response.status()).toBe(200);
    expect(body.id).toBe(usuario.id);
    expect(body.nome).toBe(updatePayload.nome);
    expect(body.email).toBe(updatePayload.email);
    expect(body.tipo).toBe(2);
    expect(body.senha).toBeUndefined();
  });

  test('CT-API-031 - Excluir usuário não-admin principal', async ({ request }) => {
    const usuario = await createUser(request, {
      tipo: 1
    });

    const response = await request.delete(`/usuarios/${usuario.id}`);
    const body = await response.json();

    console.log('DELETE /usuarios/:id status:', response.status());
    console.log('DELETE /usuarios/:id body:', body);

    expect(response.status()).toBe(200);
    expect(body.mensagem).toBe('Usuário deletado com sucesso');

    const listResponse = await request.get('/usuarios');
    const users = await listResponse.json();

    const deletedUser = users.find(item => item.id === usuario.id);

    expect(deletedUser).toBeUndefined();
  });

  test('CT-API-032 - Tentar excluir admin principal', async ({ request }) => {
    const response = await request.delete('/usuarios/1');
    const body = await response.json();

    console.log('DELETE /usuarios/1 status:', response.status());
    console.log('DELETE /usuarios/1 body:', body);

    expect(response.status()).toBe(403);
    expect(body.mensagem).toMatch(/admin principal|não pode ser deletado|nao pode ser deletado/i);
  });
});