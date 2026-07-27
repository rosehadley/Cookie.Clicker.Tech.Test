import { test as base } from '@playwright/test';
import HomePage from '../pages/home.page';
import GamePage from '../pages/game.page';

export type PageFixtures = {
    homePage: HomePage;
    gamePage: GamePage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    gamePage: async ({ page }, use) => {
        const gamePage = new GamePage(page);
        await use(gamePage);
    }
});