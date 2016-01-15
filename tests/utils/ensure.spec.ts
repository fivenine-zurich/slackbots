/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import * as Ensure from '../../src/utils/ensure';

'use strict';

describe('Ensure tests', () => {
    it('Ensure that throws error when false', () => {
        expect(() => Ensure.that(true === false, 'Expected error')).toThrow();
    });
})