/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import Ensure = require('../../src/utils/ensure');

'use strict';

describe('Ensure tests', () => {
    it('Ensure that throws error when false', () => {
        expect(() => Ensure.that(true==false, "Expected error")).toThrow();
    });
})