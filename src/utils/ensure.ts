'use strict';

export function that(condition: boolean, message: string) {
    if (!condition) {
        throw new Error(`[slackbots error] ${message}`);
    }
} 