import { Page } from "@playwright/test";

export default class GamePage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Constants
    url = (name?: string) => name ? `/game/${encodeURIComponent(name)}` : '/game/';

    // Selectors
    cookieClickerHomepageLink = () => this.page.getByRole('link', { name: 'Cookie Clicker!' });

    gameGreeting = (name: string) => this.page.getByText(`Hello ${name}`, { exact: true });

    cookieCount = () => this.page.getByTestId('cookies');

    factoriesCount = () => this.page.getByTestId('factories')
    
    moneyCount = () => this.page.getByTestId('money')

    clickCookieButton = () => this.page.getByRole('button', { name: 'Click Cookie!' });

    sellCookiesInput = () => this.page.getByTestId('cookies-to-sell');

    sellCookiesButton = () => this.page.getByRole('button', { name: 'Sell Cookies!' });

    buyFactoriesInput = () => this.page.getByTestId('factories-to-buy');

    buyFactoriesButton = () => this.page.getByRole('button', { name: 'Buy Factories!' });

    // Methods
    public async goto(name: string) {
        await this.page.goto(this.url(name));
    }

    public async getCookieCount(): Promise<number> {
        return Number(await this.cookieCount().textContent());
    }

    public async clickCookies(amount: number) {
        for (let index = 0; index < amount; index++) {
            await this.clickCookieButton().click();
        }
    }

    public async sellCookies(amount: number) {
        await this.sellCookiesInput().fill(amount.toString());
        await this.sellCookiesButton().click();
    }

    public async buyFactories(amount: number) {
        await this.buyFactoriesInput().fill(amount.toString());
        await this.buyFactoriesButton().click();
    }
}