import { APIRequestContext } from '@playwright/test';

import ClickCookie from './click-cookie.api';

export default class API {
    request: APIRequestContext;
    readonly clickCookie: ClickCookie;

    constructor(request: APIRequestContext) {
        this.request = request;
        this.clickCookie = new ClickCookie(request);
    }
}