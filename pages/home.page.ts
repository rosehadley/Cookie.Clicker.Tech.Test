import { Page , expect} from "@playwright/test";
import createUniqueName from '../helpers/create-unique-name'

export default class HomePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Selectors
    cookieClickerHeader = () => this.page.getByRole('heading', { name: 'Cookie Clicker!' });

    newGameForm = () => this.page.getByRole('form');

    nameInput = () => this.page.getByRole('textbox');

    startGameButton = () => this.page.getByRole('button', { name: 'Start!' });

    highScoresHeader = () => this.page.getByRole('heading', { name: 'High Scores' });

    scoreboard = () => this.page.getByRole('table');

    scoreboardUserRow = (name: string) => this.page.getByRole('row').filter({has: this.scoreboardUserName(name)})

    scoreboardUserName = (name: string) => this.page.getByRole('link', { name });
    
    scoreboardUserScore = (name: string) => this.scoreboardUserRow(name).getByRole('cell').nth(1);

    nthScoreboardScore = (index: number) => this.page.getByRole('row').nth(index).getByRole('cell').nth(1);


    // Methods
    public async goto() {
        await this.page.goto('', { waitUntil: 'domcontentloaded' });
        await expect(this.cookieClickerHeader(), 'The page header should be visible if the page has loaded correctly').toBeVisible();       
    }

    /**
     * Navigate's to the Cookie Clicker homepage, enters a name, and clicks Start Game! to navigate to the new game
     * @param name - A string with 10 random alphanumeric characters and an optional prefix
     */
    public async createNewGame(name: string = createUniqueName()) {
        await this.goto();

        await this.nameInput().fill(name);
        await this.startGameButton().click();
        await this.page.waitForURL(`**/game/${encodeURIComponent(name)}`);

        return name;
    }

    public async goToUserGameFromScoreboard(name: string) {
        await this.goto();

        await this.scoreboardUserName(name).click();
        await this.page.waitForURL(`**/game/${encodeURIComponent(name)}`);
    }

    public async getUserHighScoreTablePosition(name: string): Promise<number> {
        let index = await this.scoreboard().getByRole('row').evaluateAll((rows, name) => {
            return rows.findIndex( row => row.textContent?.includes(name))
        }, name);

        if (index === -1) {
            throw new Error(`The user ${name} has not been found in the High Scores table`)
        }
        return index + 1;
    }

}
