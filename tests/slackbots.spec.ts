'use strict';

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/ts-promise/dist/ts-promise.d.ts" />

import {SlackBots, ISlackApiResponse} from '../src/slackbots';
import Promise from 'ts-promise';
import * as Request from 'request';

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

describe('API call tests', () => {
    var bot: SlackBots;
    
    it('Ensure that API-error results are handled', (done) => {
        spyOn(Request, 'post').and.callFake((data: any, callback: Request.RequestCallback) => {
            let response: string = JSON.stringify({
                ok: false,
                error: 'Does not work',
            });
            
            callback(undefined, undefined, response);
        });
                
        bot = new SlackBots('this api key is invalid', 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(result.ok);
            })
            .catch(failTest())
            .finally(done);
    });
    
    it('Ensure that API errors are handled as result', (done) => {
        spyOn(Request, 'post').and.callFake((data: any, callback: Request.RequestCallback) => {
            callback(new Error('Some undefined error'), undefined, undefined);
        });
                
        bot = new SlackBots('this api key is invalid', 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(!result.ok);
            })
            .catch(failTest())
            .finally(done);
    });
    
    it('Ensure that API response parsing errors generate an error response', (done) => {
        spyOn(Request, 'post').and.callFake((data: any, callback: Request.RequestCallback) => {
            callback(undefined, undefined, '{bla,}');
        });
                
        bot = new SlackBots('this api key is invalid', 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(!result.ok);
            })
            .catch(failTest())
            .finally(done);
    });
});
