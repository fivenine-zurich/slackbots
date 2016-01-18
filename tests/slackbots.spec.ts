'use strict';

/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../node_modules/ts-promise/dist/ts-promise.d.ts" />

import SlackBots from '../src/slackbots';
import Promise from 'ts-promise';

let failTest: any = function failTest(error: any): void {
    expect(error).toBeUndefined();
};

describe('constructor tests', () => {
    var bot: SlackBots;
    
    it('Ensure that login fails with no API-key', () => {
        expect(() => {
            bot = new SlackBots(undefined, 'test-bot');    
        }).toThrow();
    });
});

describe('start tests', () => {
    var bot: SlackBots;
    
    it('Ensure that start fails with an invalid API-key', (done) => {
        
        bot = new SlackBots('this api key is invalid', 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(result.ok);
            })
            .catch(() => {
                failTest();
            })
            .finally(done);
    });
});
