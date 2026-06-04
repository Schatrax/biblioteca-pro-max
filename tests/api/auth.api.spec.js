import { test, expect } from '@playwright/test';
import { users } from '../../fixtures/users';

test.describe('Auth API', () => {
  test('CT-API-001 - Registro de novo usuário aluno com sucesso', async ({ request }) => {
    const timestamp = Date.now();

    const payload = {
      nome: `Maria Silva ${timestamp}`,
      email: `maria.silva.${timestamp}@teste.com`,
      senha: 'senha123'
    };

    const response = await request.post('/registro', {
      data: payload
    });

    const body = await response.json();

    console.log('POST /registro status:', response.status());
    console.log('POST /registro body:', body);

    expect(response.status()).toBe(201);
    expect(body.mensagem).toBe('Usuário criado com sucesso');

    expect(body.usuario).toBeTruthy();
    expect(body.usuario.id).toBeGreaterThan(0);
    expect(Number.isInteger(body.usuario.id)).toBe(true);

    expect(body.usuario.nome).toBe(payload.nome);
    expect(body.usuario.email).toBe(payload.email);

    expect(body.usuario.tipo).toBe(1);
    expect(body.usuario.senha).toBeUndefined();
  });

  test('CT-API-002 - Registro com email duplicado', async ({ request }) => {
    const payload = {
      nome: 'João Santos',
      email: users.admin.email,
      senha: 'senha456'
    };

    const response = await request.post('/registro', {
      data: payload
    });

    const body = await response.json();

    console.log('POST /registro duplicate status:', response.status());
    console.log('POST /registro duplicate body:', body);

    expect(response.status()).toBe(400);
    expect(body.mensagem).toBe('Email já cadastrado');
  });

  test('CT-API-003 - Login com credenciais válidas de admin', async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post('/login', {
      data: {
        email: users.admin.email,
        senha: users.admin.senha
      }
    });

    const responseTime = Date.now() - startTime;
    const body = await response.json();

    console.log('POST /login admin status:', response.status());
    console.log('POST /login admin body:', body);
    console.log('POST /login admin response time:', responseTime, 'ms');

    expect(response.status()).toBe(200);
    expect(body.mensagem).toBe('Login realizado com sucesso');

    expect(body.usuario).toBeTruthy();
    expect(body.usuario.email).toBe(users.admin.email);
    expect(body.usuario.tipo).toBe(users.admin.tipo);
    expect(body.usuario.senha).toBeUndefined();

    expect(responseTime).toBeLessThan(2000);
  });

  test('CT-API-004 - Login com credenciais inválidas', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        email: users.admin.email,
        senha: 'senhaerrada'
      }
    });

    const body = await response.json();

    console.log('POST /login invalid status:', response.status());
    console.log('POST /login invalid body:', body);

    expect(response.status()).toBe(401);
    expect(body.mensagem).toBe('Email ou senha incorretos');
  });
});