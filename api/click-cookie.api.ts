import { APIRequestContext } from '@playwright/test';

export default class ClickCookie {
    request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    public async clickCookie() {
        
    }
}