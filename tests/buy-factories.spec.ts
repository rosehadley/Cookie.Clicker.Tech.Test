import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';
import Pricings from '../constants/pricings'
import { faker } from '@faker-js/faker/locale/en';
import createUniqueName from '../helpers/create-unique-name';

test.describe('As a user, I can buy factories', { tag: ['@TC-022', '@TC-017'] }, () => {
    const name = createUniqueName('Buy Factories');
    test.beforeEach('Create a new game', async ({ homePage }) => {
        await homePage.createNewGame(name);
    });

    test('As a user, if I have enough money, then I can buy factories', { tag: ['@TC-037', '@TC-033', '@TC-025'] }, async ({ gamePage }) => {
        let firstMoneyCount: number = 0, firstFactoryCount: number = 0;
        let secondMoneyCount: number = 0, secondFactoryCount: number = 0;
        let thirdMoneyCount: number = 0, thirdFactoryCount: number = 0;
        let fourthMoneyCount: number = 0, fourthFactoryCount: number = 0;
        await test.step('Get cookies and sell enough so that the user can afford one factory', async () => {
            await gamePage.clickCookies(13);
            await gamePage.waitForUpdate(name);
            await gamePage.sellCookies(12);
            await gamePage.waitForUpdate(name);

            firstMoneyCount = await gamePage.getMoneyCount();
            expect.soft(firstMoneyCount, 'The money count should be $3').toBe(12 * Pricings.CookiePrice);

            firstFactoryCount = await gamePage.getFactoryCount();
            expect.soft(firstFactoryCount, 'The initial factory count should be 0').toBe(0);
        });        
        
        await test.step('Enter 1 into the buy factories textbox and buy a factory', async () => {
            await gamePage.buyFactoriesInput().fill('1')
            await gamePage.buyFactoriesButton().click();
            await gamePage.waitForUpdate(name);

            secondFactoryCount = await gamePage.getFactoryCount();
            secondMoneyCount = await gamePage.getMoneyCount();
            expect.soft(secondFactoryCount, 'The factory count should have increased by 1').toBe(firstFactoryCount + 1);
            expect.soft(secondMoneyCount, 'The money count should have decreased by $3 to $0').toBe(firstMoneyCount - Pricings.FactoryCost);
        });

        await test.step('Get cookies and sell enough so that the user can afford multiple factories', async () => {
            await gamePage.clickCookies(37);
            await gamePage.waitForUpdate(name);
            await gamePage.sellCookies(36);
            await gamePage.waitForUpdate(name);

            thirdMoneyCount = await gamePage.getMoneyCount();
            expect.soft(thirdMoneyCount, 'The money count should be correct').toBe(secondMoneyCount + (36 * Pricings.CookiePrice));

        });        
        
        await test.step('Enter 3 into the buy factories textbox and buy 3 factories', async () => {
            await gamePage.buyFactories(3);
            await gamePage.waitForUpdate(name);

            thirdFactoryCount = await gamePage.getFactoryCount();
            fourthMoneyCount = await gamePage.getMoneyCount();

            expect.soft(thirdFactoryCount, 'The factory count should have increased by 3').toBe(secondFactoryCount + 3);
            expect.soft(fourthMoneyCount, 'The money count should have decreased by the correct amount').toBe(thirdMoneyCount - (Pricings.FactoryCost * 3));
        });
    });

    test.skip('As a user, I cannot buy factories that I cannot afford', { tag: ['@TC-023'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119251722'
    } }, async ({ gamePage }) => {
        let factoryCount: number = 0, moneyCount: number = 0
        moneyCount = await gamePage.getMoneyCount();
        expect.soft(moneyCount, 'The initial money count should be 0').toBe(0);

        factoryCount = await gamePage.getFactoryCount();
        expect.soft(factoryCount, 'The initial factory count should be 0').toBe(0);
        
        await test.step('Attempt to buy a factory with no money', async () => {
            await gamePage.buyFactories(1);
            await gamePage.waitForUpdate(name);

            expect.soft(await gamePage.getFactoryCount(), 'The factory count should stay the same').toBe(factoryCount);
            expect.soft(await gamePage.getMoneyCount(), 'The money count should stay the same').toBe(moneyCount);
        });
    });

    test.skip('As a user, I should only be able to submit numbers when buying factories', { tag: ['@TC-026'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119283032'
    } }, async ({ gamePage }) => {
        await gamePage.clickCookies(13);
        await gamePage.sellCookies(12);
        await gamePage.waitForUpdate(name);
        const moneyCount = await gamePage.getMoneyCount();
        const factoryCount = await gamePage.getFactoryCount();
        
        await test.step('Enter a string into the Buy Factories textbox and attempt to click the Buy Factories! button', async () => {
            await gamePage.buyFactoriesInput().fill(faker.word.words(1));
            await gamePage.buyFactoriesButton().click();
            await gamePage.waitForUpdate(name);
        });

        // TODO: Add assertations for validation error messages and/or failed requests

        expect(await gamePage.getMoneyCount(), 'The money count should not have changed').toBe(moneyCount);
        expect(await gamePage.getFactoryCount(), 'The money count should not have changed').toBe(factoryCount);
    });

    test.skip('As a user, I should only be able to submit positive integers when buying factories', { tag: ['@TC-021', '@TC-024'], annotation: {
        type: 'Bug',
        description: `https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119251987,        
            https://rhadley98s-team.monday.com/boards/5100988704/pulses/3112355834`
    } }, async ({ gamePage }) => {
        const negativeNumber = -1, decimalNumber = 2.8;
        await gamePage.clickCookies(37);
        await gamePage.sellCookies(36);
        await gamePage.waitForUpdate(name);

        const originalFactoryCount = await gamePage.getFactoryCount();
        const originalMoneyCount = await gamePage.getMoneyCount();
        
        await test.step('Enter a negative integer into the Buy Factories textbox and attempt to click the Buy Factories! button', async () => {
            await gamePage.buyFactories(negativeNumber);
            await gamePage.waitForUpdate(name);
        });

        const secondFactoryCount = await gamePage.getFactoryCount();
        const secondMoneyCount = await gamePage.getMoneyCount();

        expect.soft(secondFactoryCount, 'The factory count should stay the same').toBe(originalFactoryCount);
        expect.soft(secondMoneyCount, 'The money count should stay the same').toBe(originalMoneyCount);

        await test.step('Enter a decimal into the Buy Factories textbox and attempt to click the Buy Factories! button', async () => {
            await gamePage.buyFactories(decimalNumber);
            await gamePage.waitForUpdate(name);
        });

        const thirdFactoryCount = await gamePage.getFactoryCount();
        const thirdMoneyCount = await gamePage.getMoneyCount();

        expect.soft(thirdFactoryCount, 'The factory count should stay the same').toBe(secondFactoryCount);
        expect.soft(thirdMoneyCount, 'The money count should stay the same').toBe(secondMoneyCount);

        if (thirdFactoryCount !== secondFactoryCount) {
            expect.soft(thirdFactoryCount, `If ${decimalNumber} factories were bought, the new factory count should be calculated correctly`).toBe(secondFactoryCount + decimalNumber);
        }
        if (thirdMoneyCount !== secondMoneyCount) {
            expect.soft(thirdMoneyCount.toString(), `If ${decimalNumber} factories were bought, the new money count should be calculated correctly`).toBe((secondMoneyCount - (decimalNumber * Pricings.FactoryCost)).toFixed(2));
        }
    });
});
