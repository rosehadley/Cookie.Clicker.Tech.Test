import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';

test.describe('As a new user, the High Scores table is displayed correctly on the homepage', () => {
    let userOne: string, userTwo: string, userThree: string, userFour: string;
    test.beforeEach('Create games with different scores', async ({ homePage, gamePage }) => {
        userOne = await homePage.createNewGame();
        await gamePage.clickCookies(3);

        userTwo = await homePage.createNewGame();
        await gamePage.clickCookies(4);

        userThree = await homePage.createNewGame();
        await gamePage.clickCookies(10);

        await homePage.goto();
    });

    test('As an existing user, I can navigate back to my game from the High Scores table on the homepage', { tag: ['@TC-008'] }, async ({ homePage, gamePage }) => {
        await test.step('Click on one of the user\'s names in the scoreboard', async () => {
            await homePage.scoreboardUserName(userOne).click();
            await gamePage.page.waitForLoadState('domcontentloaded');

            expect(gamePage.page, 'The user should be redirected to their game').toHaveURL(gamePage.url(userOne));
            expect(gamePage.gameGreeting(userOne), 'The game greeting should display the correct user\'s name').toBeVisible();
        });
    });

    test('If a user has 0 factories and their score is static, their score in the High Scores table is correct', { tag: ['@TC-007'] }, async ({ homePage }) => {
        await expect(homePage.scoreboardUserScore(userOne), 'User one should have a score of 3').toHaveText('3');
        await expect(homePage.scoreboardUserScore(userTwo), 'User two should have a score of 4').toHaveText('4');
        await expect(homePage.scoreboardUserScore(userThree), 'User three should have a score of 10').toHaveText('10');
    });

    test.skip('If a user has 0 factories and their score is static, the high scores are ordered by cookie count in descending order', { tag: ['@TC-003'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119218901'
    }}, async ({ homePage }) => {
        await test.step('Get the scoreboard position of the three players with static scores', async () => {
            const userOneScoreTablePosition = await homePage.getUserHighScoreTablePosition(userOne);
            const userTwoScoreTablePosition = await homePage.getUserHighScoreTablePosition(userTwo);
            const userThreeScoreTablePosition = await homePage.getUserHighScoreTablePosition(userThree);
            console.log(userOneScoreTablePosition, userTwoScoreTablePosition, userThreeScoreTablePosition)
            
            expect.soft(userOneScoreTablePosition, 'User One should be below User Two on the scoreboard').toBeGreaterThan(userTwoScoreTablePosition);
            expect.soft(userOneScoreTablePosition, 'User One should be below User Three on the scoreboard').toBeGreaterThan(userThreeScoreTablePosition);
            expect.soft(userTwoScoreTablePosition, 'User Two should be below User Three on the scoreboard').toBeGreaterThan(userThreeScoreTablePosition);
        }); 
    });

    test.skip('If a user has factories and their score is not static, their score in the High Scores table is dynamically updated', { tag: ['@TC-007'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119185801'
    } }, async ({ gamePage, homePage }) => {
        await test.step('Create a user that can buy a factory and have two cookies remaining', async () => {
            userFour = await homePage.createNewGame();
            await gamePage.clickCookies(14);
            await gamePage.sellCookies(12); // Each cookie sells for $0.25
            await gamePage.buyFactories(1); // Each factory costs $3
            await homePage.goto();
        });

        await test.step('Get the current score of the user, then wait 3 seconds and get their score again', async () => {
            const userFourScoreboardScore = Number(await homePage.scoreboardUserScore(userFour).textContent());
            
            await new Promise(resolve => setTimeout(resolve, 3000));

            const userFourScoreboardScoreAfter5Seconds = Number(await homePage.scoreboardUserScore(userFour).textContent());

            expect(userFourScoreboardScoreAfter5Seconds, 'The user\'s score should have increased in 5 seconds').toBeGreaterThan(userFourScoreboardScore)
        });
    });
});
