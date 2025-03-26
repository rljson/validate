// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Example, Rljson } from '@rljson/rljson';

import { describe, expect, it } from 'vitest';

import { validate } from '../src/validate';

describe('validate', () => {
  describe('validates the rljson', async () => {
    it('and returns an empty object on success ', async () => {
      const bakery = Example.ok.bakery();
      const result = await validate(bakery);
      expect(result).toEqual({});
    });

    it('and returns validation errors', async () => {
      const errorRljson = Example.broken.base.brokenTableKey() as Rljson;
      const result = await validate(errorRljson);
      expect(result).toEqual({
        base: {
          hasErrors: true,
          tableKeysNotLowerCamelCase: {
            error: 'Table names must be lower camel case',
            invalidTableKeys: ['brok$en'],
          },
        },
      });
    });
  });
});
