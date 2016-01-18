'use strict';

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/dotenv/dotenv.d.ts" />
/// <reference path="../node_modules/ts-promise/dist/ts-promise.d.ts" />

import {SlackBots, ISlackApiResponse} from '../src/slackbots';
import Promise from 'ts-promise';
import * as Request from 'request';
import Dotenv = require('dotenv'); // Required as this is an old AMD/CommonJS module

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
    
    it('Ensure that API response returns okay if the call succeeds', (done) => {
        spyOn(Request, 'post').and.callFake((data: any, callback: Request.RequestCallback) => {
            let response: string = JSON.stringify({
                ok: true,
                error: undefined,
            });
            
            callback(undefined, undefined, response);
        });
                
        bot = new SlackBots('Whatever', 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(result.ok);
                bot.quit();
            })
            .catch(failTest())
            .finally(done);
    });
});

describe('Integration tests', () => {
    var bot: SlackBots;
    
    Dotenv.load();
    if (process.env.SLACK_API_KEY) {
        it('Get login response', (done) => {
        
        bot = new SlackBots(process.env.SLACK_API_KEY, 'test-bot');
        
        bot.start()
            .then((result) => {
                expect(result.ok);
                bot.quit();
            })
            .catch(failTest())
            .finally(done);
        });   
    }
});
