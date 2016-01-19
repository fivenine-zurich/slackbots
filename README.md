# slackbots-typescript
[![Build Status](https://travis-ci.org/fiveninedigital/slackbots.svg?branch=master)](https://travis-ci.org/fiveninedigital/slackbots) 
[![Coverage Status](https://coveralls.io/repos/github/fiveninedigital/slackbots/badge.svg?branch=master)](https://coveralls.io/github/fiveninedigital/slackbots?branch=master)

A Node.js library for the Slack-API written in TypeScript.

## Installation
```
npm install slackbots-typescript --save
```

## Usage

```ts
let bot: SlackBots = new SlackBots('Insert Slack-API-Key here', 'My Bot');
```

## Credits
slackbots-typescript is loosely based on [SlackBots.js](https://github.com/mishk0/slack-bot-api), a Javascript implementation of the Slack-API.