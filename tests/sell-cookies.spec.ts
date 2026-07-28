import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';
import Pricings from '../constants/pricings'
import { faker } from '@faker-js/faker/locale/en';
import createUniqueName from '../helpers/create-unique-name';

test.describe('As a user, I can sell cookies', { tag: ['@TC-017, @TC-011']}, () => {
    const name = createUniqueName('Sell Cookies');
    test.beforeEach('Create a new game', async ({ homePage }) => {
        await homePage.createNewGame(name);
    });

    test.skip('As a user, if I own a cookie, then I can sell a cookie', { tag: ['@TC-012', '@TC-018', '@TC-017'], annotation: { 
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3112182264'
    }}, async ({ gamePage }) => {
        let cookieCount: number = 0, moneyCount: number = 0
        await test.step('Click on the \'Click Cookie!\' button and get the cookie and money count', async () => {
            await gamePage.clickCookies(1);
            await gamePage.waitForUpdate(name);

            moneyCount = await gamePage.getMoneyCount();
            expect.soft(moneyCount, 'The initial money count should be 0').toBe(0);

            cookieCount = await gamePage.getCookieCount();
            expect.soft(cookieCount, 'The cookie count should be 1').toBe(1);
        });        
        
        await test.step('Enter 1 into the sell cookies textbox and sell the cookie', async () => {
            await gamePage.sellCookiesInput().fill('1');
            await gamePage.sellCookiesButton().click();
            await gamePage.waitForUpdate(name);

            expect.soft(await gamePage.getCookieCount(), 'The cookie count should have decreased by 1').toBe(cookieCount - 1);
            expect.soft(await gamePage.getMoneyCount(), 'The money count should have increased by $0.25').toBe(moneyCount + Pricings.CookiePrice);
        });
    });

    test('As a user, I can sell cookies', { tag: ['@TC-012', '@TC-016', '@TC-018', '@TC-017'] }, async ({ gamePage }) => {
        let cookieCount: number = 0, moneyCount: number = 0
        await test.step('Click on the \'Click Cookie!\' button multiple times and get the cookie and money count', async () => {
            await gamePage.clickCookies(10);
            await gamePage.waitForUpdate(name);

            moneyCount = await gamePage.getMoneyCount();
            expect.soft(moneyCount, 'The initial money count should be 0').toBe(0);

            cookieCount = await gamePage.getCookieCount();
            expect.soft(cookieCount, 'The cookie count should be 10').toBe(10);
        });        
        
        await test.step('Enter 1 into the sell cookies textbox and sell the cookie', async () => {
            await gamePage.sellCookies(1);
            await gamePage.waitForUpdate(name);

            expect.soft(await gamePage.getCookieCount(), 'The cookie count should have decreased by 1').toBe(cookieCount - 1);
            expect.soft(await gamePage.getMoneyCount(), 'The money count should have increased by $0.25').toBe(moneyCount + Pricings.CookiePrice);
        });

        await test.step('Enter 3 into the sell cookies textbox and sell the cookies', async () => {
            moneyCount = await gamePage.getMoneyCount();
            cookieCount = await gamePage.getCookieCount();

            await gamePage.sellCookies(3);
            await gamePage.waitForUpdate(name);

            expect.soft(await gamePage.getMoneyCount(), 'The money count should have increased by 3 * $0.25').toBe(moneyCount + (3 * Pricings.CookiePrice));
            expect.soft(await gamePage.getCookieCount(), 'The cookie count should have decreased by 3').toBe(cookieCount - Pricings.FactoryCost);
        });
    });

    test('As a user, I cannot sell cookies that I do not own', { tag: ['@TC-013'] }, async ({ gamePage }) => {
        let cookieCount: number = 0, moneyCount: number = 0
        await test.step('Click on the \'Click Cookie!\' button once and get the cookie and money count', async () => {
            await gamePage.clickCookies(1);
            await gamePage.waitForUpdate(name);

            moneyCount = await gamePage.getMoneyCount();
            expect.soft(moneyCount, 'The initial money count should be 0').toBe(0);

            cookieCount = await gamePage.getCookieCount();
            expect.soft(cookieCount, 'The cookie count should be 1').toBe(1);
        });        
        
        await test.step('Attempt to sell two cookies', async () => {
            await gamePage.sellCookies(2);
            await gamePage.waitForUpdate(name);

            expect.soft(await gamePage.getCookieCount(), 'The cookie count should stay the same').toBe(cookieCount);
            expect.soft(await gamePage.getMoneyCount(), 'The money count should stay the same').toBe(moneyCount);
        });
    });

    test.skip('As a user, I should only be able to submit numbers when selling cookies', { tag: ['@TC-014'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119283032'
    } }, async ({ gamePage }) => {
        await gamePage.clickCookies(3);
        await gamePage.waitForUpdate(name);     
        
        await test.step('Enter a string into the Sell Cookies textbox and attempt to click the Sell Cookies! button', async () => {
            await gamePage.sellCookiesInput().fill(faker.word.words(1));
            await gamePage.sellCookiesButton().click();
            await gamePage.waitForUpdate(name);
        });

        // TODO: Add assertations for validation error messages and/or failed requests
    });

    test.skip('As a user, I should only be able to submit positive integers when selling cookies', { tag: ['@TC-015', '@TC-019', '@'], annotation: {
        type: 'Bug',
        description: `https://rhadley98s-team.monday.com/boards/5100988704/pulses/3112405172,
            https://rhadley98s-team.monday.com/boards/5100988704/pulses/3112355834,
            https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119251871`
    } }, async ({ gamePage }) => {
        const negativeNumber = -2, decimalNumber = 2.4;
        await gamePage.clickCookies(3);
        await gamePage.waitForUpdate(name);

        const originalCookieCount = await gamePage.getCookieCount();
        const originalMoneyCount = await gamePage.getMoneyCount();
        
        await test.step('Enter a negative integer into the Sell Cookies textbox and attempt to click the Sell Cookies! button', async () => {
            await gamePage.sellCookies(negativeNumber);
            await gamePage.waitForUpdate(name);
        });

        const secondCookieCount = await gamePage.getCookieCount();
        const secondMoneyCount = await gamePage.getMoneyCount();

        expect.soft(secondCookieCount, 'The cookie count should stay the same').toBe(originalCookieCount);
        expect.soft(secondMoneyCount, 'The money count should stay the same').toBe(originalMoneyCount);

        if (secondCookieCount !== originalCookieCount) {
            expect.soft(secondCookieCount, `If ${negativeNumber} cookies were sold, the new cookie count should be calculated correctly`).toBe(originalCookieCount - negativeNumber);
        }
        if (secondMoneyCount !== originalMoneyCount) {
            expect.soft(secondMoneyCount.toString(), `If ${negativeNumber} cookies were sold, the new money count should be calculated correctly`).toBe((originalMoneyCount + (negativeNumber * Pricings.CookiePrice)).toFixed(2));
        }

        await test.step('Enter a decimal into the Sell Cookies textbox and attempt to click the Sell Cookies! button', async () => {
            await gamePage.sellCookies(decimalNumber);
            await gamePage.waitForUpdate(name);
        });

        const thirdCookieCount = await gamePage.getCookieCount();
        const thirdMoneyCount = await gamePage.getMoneyCount();

        expect.soft(thirdCookieCount, 'The cookie count should stay the same').toBe(secondCookieCount);
        expect.soft(thirdMoneyCount, 'The money count should stay the same').toBe(secondMoneyCount);

        if (thirdCookieCount !== secondCookieCount) {
            expect.soft(thirdCookieCount, `If ${decimalNumber} cookies were sold, the new cookie count should be calculated correctly`).toBe(secondCookieCount - decimalNumber);
        }
        if (thirdMoneyCount !== secondMoneyCount) {
            expect.soft(thirdMoneyCount.toString(), `If ${decimalNumber} cookies were sold, the new money count should be calculated correctly`).toBe((secondMoneyCount + (decimalNumber * Pricings.CookiePrice)).toFixed(2));
        }
    });
});
