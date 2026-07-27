import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';
import createUniqueName from '../helpers/create-unique-name';
import { faker } from '@faker-js/faker/locale/en';

test.describe('As a new user, I can create a new Cookie Clicker game session if I enter my details correctly', () => {
    test('As a new user, I am able to enter my name to create a new game', { tag: ['@TC-004'] }, async ({ homePage, gamePage }) => {
        const name = createUniqueName('Rose Hadley')
        await test.step('Visit the Cookie Clicker homepage', async () => {
            await homePage.goto();
        });

        await test.step('Enter your name into the name textbox', async () => {
            await homePage.nameInput().fill(name);
            await expect.soft(homePage.nameInput(), 'The name textbox should be populated correctly').toHaveValue(name);
        });

        await test.step('Click to create the new game session', async () => {
            await homePage.startGameButton().click();
            await expect(gamePage.page, 'Clicking \'Start Game!\' should redirect the user to the game page' ).toHaveURL(gamePage.url(name));
        });
    });

    test.skip('As a new user, I cannot create a new game if I do not provide a name', { tag: ['@TC-006'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119016805'
    } }, async ({ homePage, gamePage }) => {
        await test.step('Visit the Cookie Clicker homepage', async () => {
            await homePage.goto();
        });

        await test.step('Click the Start Game button without entering a name', async () => {
            await homePage.startGameButton().click();
            await expect.soft(homePage.page, 'The user should not be redirected to the game page').not.toHaveURL(gamePage.url());
            await expect.soft(homePage.page, ' The user should stay on the homepage').toHaveURL('');
        });
    });

    test.skip('As a new user, I cannot create a new game with a name that is has already been used', { tag: ['@TC-005'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119017780'
    } }, async ({ homePage, gamePage }) => {
        const name = createUniqueName('Rose');
        await test.step('Create a new game with a unique name', async () => {
            await homePage.createNewGame(name);
        });

        await test.step('Navigate back to the Cookie Clicker homepage and enter same name', async () => {
            await homePage.goto();
            await homePage.nameInput().fill(name);
        });

        await test.step('Click the Start Game button', async () => {
            await homePage.startGameButton().click();
            await expect.soft(homePage.page, 'The user should not be redirected to the game page').not.toHaveURL(gamePage.url(name));
            await expect.soft(homePage.page, ' The user should stay on the homepage').toHaveURL('');
        });
    });

    test.skip('As a new user, I should not be able to enter reserved characters as my name when creating a game', { tag: ['@TC-031'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119049190',
    }}, async ({ homePage, gamePage }) => {
        const invalidName = ';?+=$';
        await test.step('Visit the Cookie Clicker homepage', async () => {
            await homePage.goto();
        });

        await test.step('Enter characters that are reserved for query components', async () => {
            await homePage.goto();
            await homePage.nameInput().fill(invalidName);
        });

        await test.step('Click the Start Game button', async () => {
            await homePage.startGameButton().click();
            console.log(gamePage.url(invalidName))
            await expect.soft(homePage.page, 'The user should not be redirected to the game page').not.toHaveURL(gamePage.url(invalidName));
            await expect.soft(homePage.page, ' The user should stay on the homepage').toHaveURL('');
        });
    });

    test.skip('As a new user, there should be a character limit on my name when creating a game', { tag: ['@TC-032'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119126311',
    }}, async ({ homePage, gamePage }) => {
        const name500Characters = faker.string.alphanumeric(500);
        await test.step('Visit the Cookie Clicker homepage', async () => {
            await homePage.goto();
        });

        await test.step('Enter a name with 500 characters characters', async () => {
            await homePage.goto();
            await homePage.nameInput().fill(name500Characters);
        });

        await test.step('Click the Start Game button', async () => {
            await homePage.startGameButton().click();
            console.log(gamePage.url(name500Characters))
            await expect.soft(homePage.page, 'The user should not be redirected to the game page').not.toHaveURL(gamePage.url(name500Characters));
            await expect.soft(homePage.page, ' The user should stay on the homepage').toHaveURL('');
        });

        await test.step('Reload the homepage to ensure it loads correctly', async () => {
            await homePage.goto();
        });
    });
});
