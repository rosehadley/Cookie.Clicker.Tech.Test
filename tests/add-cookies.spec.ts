import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';
import createUniqueName from '../helpers/create-unique-name';

test.describe('As a new user, I can add cookies to my game', () => {
    const name = createUniqueName('Rose Add Cookies');
    test.beforeEach('Create a new game', async ({ homePage }) => {
        await homePage.createNewGame(name);
    });

    test('As a user, when I click to get a cookie, my cookie count increases by one cookie per click', { tag: ['@TC-010', '@TC-011'] }, async ({ gamePage }) => {
        let originalCookieCount = await gamePage.getCookieCount();
        expect(originalCookieCount, 'There should be a cookie count of 0 displayed before clicking to collect cookies').toBe(0);

        await test.step('Click on the \'Click Cookie!\' button and get the new cookie count', async () => {
            await gamePage.clickCookieButton().click();
            await gamePage.waitForUpdate(name);
            const newCookieCount = await gamePage.getCookieCount();
            expect(newCookieCount, 'The new cookie count should be the previous cookie count plus one').toBe(originalCookieCount + 1);

            await gamePage.clickCookies(5);
            await gamePage.waitForUpdate(name);
            expect(await gamePage.getCookieCount(), 'The cookie count should have increased by 5').toBe(newCookieCount + 5);
        });
    });
});
