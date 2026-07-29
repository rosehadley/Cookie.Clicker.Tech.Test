# Cookie Clicker Tech Test

This project contains Playwright end-to-end UI tests for the Cookie Clicker application.

## Documentation of Test Cases and Bugs
A user must be invited to the project for full access to the boards and work items
- Test Cases kanban board preview: https://view.monday.com/5100988703-adc2dd92cb4de395061ab94112dc19f8?r=euc1&is_sharable_link=true
- Test Cases table preview: https://view.monday.com/5100988703-1ed9d6c9ad2ccd27c78902373ba1a559?r=euc1&is_sharable_link=true
- Bugs table preview: https://view.monday.com/5100988704-b2f1ff48e5b13055e65a2739f6b01588?r=euc1&is_sharable_link=true

## Prerequisites

Before running the tests, make sure you have:

- Node.js installed https://nodejs.org/en/download
- npm installed

## Installation

1. Clone the repository
   ```
   bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. Install dependencies 
    ``` 
    npm install 
    ```

3. Install Playwright browsers
    ```
    npx playwright install
    ```

## Running tests
- Run all tests:
    ``` 
    npx playwright test
    ```

- Run a specific test file:
    ```
    npx playwright test tests/sell-cookies.spec.ts
    ```

- Run in headed mode:
    ```
    npx playwright test --headed
    ```

- Run with UI runner open:
    ``` 
    npx playwright test --ui
    ```

## Viewing reports
After a test run, open the HTML report:
```
npx playwright show-report
```

## Project structure
- tests/ - test files
- pages/ - page object models
- fixtures/ - test fixtures
- helpers/ - any helper functions
- constants/ - shared constants such as pricing values and other fixed test data
- playwright.config.ts - Playwright configuration
