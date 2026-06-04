import { expect } from '@playwright/test';

export class LivrosPage {
    constructor(page) {
        this.page = page;

        this.nomeInput = page.getByRole('textbox', { name: /nome/i });
        this.autorInput = page.getByRole('textbox', { name: /autor/i });
        this.paginasInput = page.getByRole('spinbutton', { name: /páginas|paginas/i });
        this.descricaoInput = page.getByRole('textbox', { name: /descrição|descricao/i });
        this.imagemInput = page.getByRole('textbox', { name: /imagem|url/i });
        this.estoqueInput = page.getByRole('spinbutton', { name: /estoque/i });
        this.precoInput = page.getByRole('spinbutton', { name: /preço|preco/i });

        this.adicionarLivroButton = page.getByRole('button', { name: /adicionar livro/i });
    }

    async goto() {
        await this.page.goto('/livros.html');
    }

    async fillBookForm({ nome, autor, paginas, descricao, imagemUrl, estoque, preco }) {
        await this.nomeInput.fill(nome);
        await this.autorInput.fill(autor);
        await this.paginasInput.fill(String(paginas));
        await this.descricaoInput.fill(descricao);
        await this.imagemInput.fill(imagemUrl);
        await this.estoqueInput.fill(String(estoque));
        await this.precoInput.fill(String(preco));
    }

    async submitBook() {
        await this.adicionarLivroButton.click();
    }

    async expectBookVisible(bookName) {
        await expect(this.page.locator('body')).toContainText(bookName);
    }

    async expectFormCleared() {
        await expect(this.nomeInput).toHaveValue('');
        await expect(this.autorInput).toHaveValue('');
        await expect(this.paginasInput).toHaveValue('');
        await expect(this.descricaoInput).toHaveValue('');
        await expect(this.imagemInput).toHaveValue('');

        // Estes campos voltam aos valores default definidos pela aplicação
        await expect(this.estoqueInput).toHaveValue('1');
        await expect(this.precoInput).toHaveValue('0');
    }

    async expectRequiredValidationOnName() {
        const isInvalid = await this.nomeInput.evaluate(element => !element.checkValidity());
        expect(isInvalid).toBe(true);
    }
}