import { test, expect } from '@playwright/test';

function createBookPayload(overrides = {}) {
    const timestamp = Date.now();

    return {
        nome: `Livro Favorito ${timestamp}`,
        autor: 'Autor Favorito',
        paginas: 180,
        descricao: 'Livro criado para testes de favoritos',
        imagemUrl: 'https://exemplo.com/favorito.jpg',
        estoque: 5,
        preco: 29.9,
        ...overrides
    };
}

async function createBook(request, overrides = {}) {
    const payload = createBookPayload(overrides);

    const response = await request.post('/livros', { data: payload });
    expect(response.status()).toBe(201);

    const body = await response.json();

    console.log('Livro criado para favoritos:', body);

    return body;
}

test.describe('Favoritos API', () => {
    const usuarioId = 1;

    test('CT-API-014 - Adicionar livro aos favoritos', async ({ request }) => {
        const livro = await createBook(request);

        const response = await request.post('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        const body = await response.json();

        console.log('POST /favoritos status:', response.status());
        console.log('POST /favoritos body:', body);

        expect(response.status()).toBe(201);
        expect(body.mensagem).toBe('Livro adicionado aos favoritos');
    });

    test('CT-API-015 - Adicionar livro já favoritado', async ({ request }) => {
        const livro = await createBook(request);

        const firstResponse = await request.post('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        expect(firstResponse.status()).toBe(201);

        const secondResponse = await request.post('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        const body = await secondResponse.json();

        console.log('POST /favoritos duplicate status:', secondResponse.status());
        console.log('POST /favoritos duplicate body:', body);

        expect(secondResponse.status()).toBe(400);
        expect(body.mensagem).toMatch(/favoritos|favorito|já/i);
    });

    test('CT-API-016 - Listar favoritos de usuário', async ({ request }) => {
        const livro = await createBook(request);

        const favoriteResponse = await request.post('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        expect(favoriteResponse.status()).toBe(201);

        const response = await request.get(`/favoritos/${usuarioId}`);
        const body = await response.json();

        console.log('GET /favoritos/:usuarioId status:', response.status());
        console.log('GET /favoritos/:usuarioId body:', body);

        expect(response.status()).toBe(200);
        expect(Array.isArray(body)).toBe(true);

        const livroFavoritado = body.find(item => item.id === livro.id);

        expect(livroFavoritado).toBeTruthy();
        expect(livroFavoritado.nome).toBe(livro.nome);
    });

    test('CT-API-017 - Remover livro dos favoritos', async ({ request }) => {
        const livro = await createBook(request);

        const favoriteResponse = await request.post('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        expect(favoriteResponse.status()).toBe(201);

        const deleteResponse = await request.delete('/favoritos', {
            data: {
                usuarioId,
                livroId: livro.id
            }
        });

        const deleteBody = await deleteResponse.json();

        console.log('DELETE /favoritos status:', deleteResponse.status());
        console.log('DELETE /favoritos body:', deleteBody);

        expect(deleteResponse.status()).toBe(200);
        expect(deleteBody.mensagem).toBe('Livro removido dos favoritos');

        const listResponse = await request.get(`/favoritos/${usuarioId}`);
        const favoritos = await listResponse.json();

        const livroAindaFavoritado = favoritos.find(item => item.id === livro.id);

        expect(livroAindaFavoritado).toBeUndefined();
    });
});