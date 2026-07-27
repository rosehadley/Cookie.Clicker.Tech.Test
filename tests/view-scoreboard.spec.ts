import { expect } from '@playwright/test';
import { test } from '../fixtures/base-test';

test.describe('As a new user, the High Scores table is displayed correctly on the homepage', () => {
    let userOne: string, userTwo: string, userThree: string, userFour: string;
    test.beforeAll('Create games with different scores', async ({ homePage, gamePage }) => {
        userOne = await homePage.createNewGame();
        await gamePage.clickCookies(3);
        
        userTwo = await homePage.createNewGame();
        await gamePage.clickCookies(10);

        userThree = await homePage.createNewGame();
        await gamePage.clickCookies(4);

        await test.step('Create a user that can buy two factories with one cookie remaining', async () => {
            userFour = await homePage.createNewGame();
            await gamePage.clickCookies(7);
            await gamePage.buyFactories(2);
        });

        await homePage.goto();
    });

    test('As an existing user, I can navigate back to my game from the High Scores table on the homepage', { tag: ['@TC-008'] }, async ({ homePage, gamePage }) => {
        await test.step('Click on one of the user\'s names in the scoreboard', async () => {
            await homePage.scoreTableUserName(userOne).click();

            expect(gamePage.page, 'The user should be redirected to their game').toHaveURL(gamePage.url(userOne));
            expect(gamePage.gameGreeting(userOne), 'The game greeting should display the correct user\'s name').toBeVisible();
        });
    });

    test('If a user has 0 factories and their score is static, their score in the High Scores table is correct', { tag: ['@TC-007'] }, async ({ homePage }) => {
        await expect(homePage.scoreTableUserScore(userOne), 'User one should have a score of 3').toHaveText('3');
        await expect(homePage.scoreTableUserScore(userTwo), 'User two should have a score of 10').toHaveText('10');
        await expect(homePage.scoreTableUserScore(userThree), 'User three should have a score of 4').toHaveText('4');
    });

    test('If a user has 0 factories and their score is static, the high scores are ordered by cookie count in descending order', { tag: ['@TC-003'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119218901'
    }}, async ({ homePage }) => {
        await test.step('Get the scoreboard position of the three players with static scores', async () => {
            const userOneScoreTablePosition = await homePage.getUserHighScoreTablePosition(userOne);
            const userTwoScoreTablePosition = await homePage.getUserHighScoreTablePosition(userTwo);
            const userThreeScoreTablePosition = await homePage.getUserHighScoreTablePosition(userThree);
            
            expect(userOneScoreTablePosition, 'User One should be below User Two on the scoreboard').toBeLessThan(userTwoScoreTablePosition);
            expect(userOneScoreTablePosition, 'User One should be lower than User Three on the scoreboard').toBeLessThan(userThreeScoreTablePosition);
            expect(userTwoScoreTablePosition, 'User Two should be higher than User Three on the scoreboard').toBeGreaterThan(userThreeScoreTablePosition);
        }); 
    });

    test('If a user has factories and their score is not static, their score in the High Scores table is dynamically updated', { tag: ['@TC-007'], annotation: {
        type: 'Bug',
        description: 'https://rhadley98s-team.monday.com/boards/5100988704/pulses/3119185801'
    } }, async ({ homePage }) => {
        await test.step('Get the current score of the user, then wait 5 seconds and get their score again', async () => {        
            const userFourScoreboardScore = Number(await homePage.scoreTableUserScore(userFour).innerText());
            
            await new Promise(resolve => setTimeout(resolve, 5000));

            const userFourScoreboardScoreAfter5Seconds = Number(await homePage.scoreTableUserScore(userFour).innerText());

            expect(userFourScoreboardScoreAfter5Seconds, 'The user\'s score should have increased in 5 seconds').toBeGreaterThan(userFourScoreboardScore)
        });
    });
});
