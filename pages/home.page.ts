import { Page } from "@playwright/test";
import createUniqueName from '../helpers/create-unique-name'

export default class HomePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Selectors
    cookieClickerHeader = () => this.page.getByRole('heading', { name: 'Cookie Clicker!' });

    newGameForm = () => this.page.getByRole('form');

    nameInput = () => this.newGameForm().locator('input');

    startGameButton = () => this.newGameForm().getByRole('button', { name: 'Start!' });

    highScoresHeader = () => this.page.getByRole('heading', { name: 'High Scores' });

    highScoresTable = () => this.page.getByRole('table').filter({ hasText: 'Player' })

    // Methods
    public async goto() {}

    public async createNewGame(name: string = createUniqueName()) {
        await this.goto();
        await this.page.waitForEvent('domcontentloaded');

        await this.nameInput().fill(name);
        await this.startGameButton().click();
        await this.page.waitForURL('**/game/**');
    }
}
