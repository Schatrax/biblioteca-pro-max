import { test, expect } from '@playwright/test';

test.describe('Estatísticas API', () => {
    test('CT-API-013 - Obter estatísticas da biblioteca', async ({ request }) => {
        const response = await request.get('/estatisticas');
        const body = await response.json();

        console.log('GET /estatisticas status:', response.status());
        console.log('GET /estatisticas body:', body);

        expect(response.status()).toBe(200);

        expect(body).toHaveProperty('totalLivros');
        expect(body).toHaveProperty('totalPaginas');
        expect(body).toHaveProperty('totalUsuarios');
        expect(body).toHaveProperty('usuariosPorTipo');
        expect(body).toHaveProperty('livrosDisponiveis');
        expect(body).toHaveProperty('arrendamentosPendentes');
        expect(body).toHaveProperty('comprasPendentes');

        expect(Number.isInteger(body.totalLivros)).toBe(true);
        expect(Number.isInteger(body.totalPaginas)).toBe(true);
        expect(Number.isInteger(body.totalUsuarios)).toBe(true);
        expect(Number.isInteger(body.livrosDisponiveis)).toBe(true);
        expect(Number.isInteger(body.arrendamentosPendentes)).toBe(true);
        expect(Number.isInteger(body.comprasPendentes)).toBe(true);

        expect(body.totalLivros).toBeGreaterThanOrEqual(0);
        expect(body.totalPaginas).toBeGreaterThanOrEqual(0);
        expect(body.totalUsuarios).toBeGreaterThanOrEqual(0);
        expect(body.livrosDisponiveis).toBeGreaterThanOrEqual(0);
        expect(body.arrendamentosPendentes).toBeGreaterThanOrEqual(0);
        expect(body.comprasPendentes).toBeGreaterThanOrEqual(0);

        expect(body.usuariosPorTipo).toHaveProperty('alunos');
        expect(body.usuariosPorTipo).toHaveProperty('funcionarios');
        expect(body.usuariosPorTipo).toHaveProperty('admins');

        const totalPorTipo =
            body.usuariosPorTipo.alunos +
            body.usuariosPorTipo.funcionarios +
            body.usuariosPorTipo.admins;

        expect(totalPorTipo).toBe(body.totalUsuarios);
    });
});