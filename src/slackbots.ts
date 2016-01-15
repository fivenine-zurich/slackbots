/// <reference path="../typings/tsd.d.ts" />

import * as Ensure from './utils/ensure';
import * as Request from 'request';

'use strict';

class SlackApiRequestData {
    
    private _url: string;
    
    public get url(): string {
        return this._url;
    }
    
    public set methodName(v: string) {
        this._url = `https://slack.com/api/${v}`;
    }
}

export default class SlackBots {
    
    private token: string;
    private name: string;
    
    /**
     * Creates a new instance of the SlackBot.
     * @param  {string} token The slack-bot API token.
     * @param  {string} name The slack-bot name.
     */
    constructor(token: string, name: string) {
        this.token = token;
        this.name = name;
        
        Ensure.that(this.token !== undefined, 'The Slack API-Token is undefined');
        
        this.login();
    }
    
    private login(): void {
        this.callApi('rtm.start').then( (data: any) => {
            
            console.log(data);
            
        }).catch((reason: any) => {
            
            console.error(reason);
            
        });
    }
    
    private callApi(methodName: string): Promise<any> {
        
        let uri: string = 'https://slack.com/api/' + methodName;
        
        return new Promise<any>((resolve: any, reject: any) => {
            Request.post({url: uri}, (err: Error, request: any, body: any) => {
                
                if (err) {
                    reject(err);
                    return false;
                }
                
                try {
                    body = JSON.parse(body);
                    
                    if (body.ok) {
                        resolve(body);
                    } else {
                        reject(body);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
}
