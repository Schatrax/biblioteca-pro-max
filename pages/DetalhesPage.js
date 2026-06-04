import { expect } from '@playwright/test';

export class DetalhesPage {
    constructor(page) {
        this.page = page;

        this.favoriteButton = page.getByRole('button', { name: /favoritos/i });
        this.addFavoriteButton = page.getByRole('button', { name: /adicionar aos favoritos/i });
        this.removeFavoriteButton = page.getByRole('button', { name: /remover dos favoritos/i });
        this.deleteButton = page.getByRole('button', { name: /deletar livro|excluir livro/i });
    }

    async goto(bookId) {
        await this.page.goto(`/detalhes.html?id=${bookId}`);
    }

    async expectOnDetailsPage(bookId) {
        await expect(this.page).toHaveURL(new RegExp(`detalhes\\.html\\?id=${bookId}`));
    }

    async expectBookDetailsVisible(book) {
        await expect(this.page.locator('body')).toContainText(book.nome);
        await expect(this.page.locator('body')).toContainText(book.autor);
        await expect(this.page.locator('body')).toContainText(String(book.paginas));
        await expect(this.page.locator('body')).toContainText(book.descricao);

        await expect(this.favoriteButton).toBeVisible();
        await expect(this.deleteButton).toBeVisible();
    }

    async addToFavorites() {
        await this.addFavoriteButton.click();
    }

    async removeFromFavorites() {
        await this.removeFavoriteButton.click();
    }

    async expectRemoveFavoriteButtonVisible() {
        await expect(this.removeFavoriteButton).toBeVisible();
    }

    async expectAddFavoriteButtonVisible() {
        await expect(this.addFavoriteButton).toBeVisible();
    }
}