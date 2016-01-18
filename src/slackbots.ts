/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/ts-promise/dist/ts-promise.d.ts" />

import * as Ensure from './utils/ensure';
import * as Request from 'request';
import Promise from 'ts-promise';

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

export interface ISlackApiResponse {
    ok: boolean;
    
    error?: string;
}

export class SlackBots {
    
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
    }
    
    public start(): Promise<ISlackApiResponse> {
        return this.login();
    }
    
    private login(): Promise<ISlackApiResponse> {
        return new Promise<ISlackApiResponse>((resolve, reject) => {
            
            this.callApi('rtm.start').then((response) => {
                
                console.log('Respose recieved');
                resolve(response);
                
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    private callApi(methodName: string): Promise<ISlackApiResponse> {
        
        let uri: string = 'https://slack.com/api/' + methodName;
        
        return new Promise<ISlackApiResponse>((resolve, reject) => {

            Request.post({url: uri}, (err: Error, request: any, body: string) => {
                               
                if (err) {
                    reject(err);
                }
                
                try {
                    let response: ISlackApiResponse = <ISlackApiResponse> JSON.parse(body);
                                                            
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject(new Error(response.error));
                    }
                } catch (e) {                   
                    reject(e);
                }
            });
        });
    }
}
