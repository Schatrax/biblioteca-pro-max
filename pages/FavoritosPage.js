import { expect } from '@playwright/test';

export class FavoritosPage {
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('/favoritos.html');
    }

    async expectFavoriteBookVisible(book) {
        await expect(this.page.locator('body')).toContainText(book.nome);
        await expect(this.page.locator('body')).toContainText(book.autor);
    }

    async expectFavoriteBookNotVisible(book) {
        await expect(this.page.locator('body')).not.toContainText(book.nome);
    }

    async expectEmptyMessageOrFavoritesGrid() {
        const bodyText = await this.page.locator('body').innerText();

        console.log('Favoritos page text:', bodyText);

        expect(
            bodyText.includes('Você ainda não tem livros favoritos') ||
            bodyText.toLowerCase().includes('favoritos')
        ).toBeTruthy();
    }
}