'use strict';

/// <reference path="../typings/jasmine/jasmine.d.ts" />

import SlackBots from '../src/slackbots';

describe('SlackBots tests', () => {
    var bot: SlackBots;
    
    it('Ensure that login fails with no API-key', () => {
        expect(() => {
            bot = new SlackBots('notoken', 'test-bot');    
        }).toThrow();
    });
});
