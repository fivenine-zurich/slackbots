'use strict';

import Ensure = require('./utils/ensure');

namespace slackbots {
    export class SlackBots {
        
        private token: string;
        private name: string;
        
        constructor(token: string, name: string) {
            this.token = token;
            this.name = name;
            
            Ensure.that(this.token != undefined, 'The Slack API-Token is undefined');
        }
    }
}