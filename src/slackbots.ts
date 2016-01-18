/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/ts-promise/dist/ts-promise.d.ts" />

import * as Ensure from './utils/ensure';
import * as Request from 'request';
import Promise from 'ts-promise';
import * as WebSocket from 'ws';

'use strict';

interface ISlackEvent {
    type: string;
    data: any;
}

export interface ISlackApiResponse {
    ok: boolean;
    
    error?: string;
}

export interface ISlackLoginApiResponse extends ISlackApiResponse {
    url: string;
    self: ISlackProfileInfo;
    team: any;
    users: ISlackUser[];
    channels: ISlackChannel[];
    groups: any;
    mpims: any;
    ims: any;
    bots: any;
}

export interface ISlackChannel {
    id: string;
    name: string;
    created: string;
}

export interface ISlackUser {
    id: string;
    name: string;
    deleted: boolean;
    color: string;
    
    profile: ISlackUserProfile;
    
    is_admin: boolean;
    is_owner: boolean;    
}

export interface ISlackUserProfile {
    first_name: string;
    last_name: string;
    real_name: string;
    email: string;
    skype: string;
    phone: string;
    image_24: string;
    image_32: string;
    image_48: string;
    image_72: string;
    image_192: string;
}

export interface ISlackProfileInfo {
    id: string;
    name: string;
    created: number;
    manual_presence: string;
    profile: any;
}

export class SlackBots {
    
    private _ws: WebSocket;
    
    private _token: string;
    private _name: string;
    private _wsUrl: string;
    private _users: ISlackUser[];
    private _channels: ISlackChannel[];
    private _self: ISlackProfileInfo;
        
    /**
     * Creates a new instance of the SlackBot.
     * @param  {string} token The slack-bot API token.
     * @param  {string} name The slack-bot name.
     */
    constructor(token: string, name: string) {
        this._token = token;
        this._name = name;
        
        Ensure.that(this._token !== undefined, 'The Slack API-Token is undefined');
    }
    
    public start(): Promise<ISlackApiResponse> {
        return this.login()
            .then(resp => this.connect());
    }
    
    public quit(): void {
        if (this._ws) {
           this._ws.close();
           this._wsUrl = undefined;
        }
    }
    
    private login(): Promise<ISlackApiResponse> {
        return new Promise<ISlackApiResponse>((resolve, reject) => {
            
            this.callApi('rtm.start').then((response: ISlackLoginApiResponse) => {
                
                this._wsUrl = response.url;
                this._self = response.self;
                this._users = response.users;
                this._channels = response.channels;
                                
                resolve(response);
                
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    private connect(): Promise<ISlackApiResponse> {
        return new Promise<ISlackApiResponse>((resolve, reject) => {
            
            try {
                this._ws = new WebSocket(this._wsUrl);
            } catch (error) {
                reject(error);
            }
            
            this._ws.onerror = ( (e) => {
                reject(new Error('Socket error'));
            });
            
            this._ws.onopen = ( (e) => {
                let response: ISlackApiResponse = <ISlackApiResponse> {
                    ok: true
                };
                
                console.log('Opened WS connection to ' + this._wsUrl);
                resolve(response);
            });
            
            this._ws.onmessage = this.onWsMessage;
        });      
    }
    
    private onWsMessage(event: ISlackEvent): void {
        
        if (event.type === 'message') {
            console.log(event.data);
        }
    }
    
    private callApi(methodName: string): Promise<ISlackApiResponse> {
        
        let uri: string = 'https://slack.com/api/' + methodName;
        
        return new Promise<ISlackApiResponse>((resolve, reject) => {
            
            let data: any = {
                url: uri, 
                form: { 
                    token: this._token,
                    no_unreads: true,                                 
                },
            };
            
            Request.post(data, (err: Error, request: any, body: string) => {
                               
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
