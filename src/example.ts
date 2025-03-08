// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Rljson } from '@rljson/format';

import { validate } from './validate.ts';

/**
 * The example function demonstrates how the package works
 */
export const example = () => {
  const h1 = (text: string) => console.log(`\n${text}`);
  const p = (text: string) => console.log(`  ${text}`);

  // ..........................................
  h1('Rljson is fine? validate return empty JSON.');
  const okJson: Rljson = {
    tableOne: { _type: 'properties', _data: [] },
    tableTwo: { _type: 'properties', _data: [] },
  };
  const okResult = validate(okJson);
  p(JSON.stringify(okResult, null, 2));

  // ..............................................
  h1('Table is missing? validate returns error JSON.');
  const errJson: Rljson = {
    table_One: { _type: 'properties', _data: [{ x_7: 5 }] },
    table_Two: { _type: 'properties', _data: [] },
  };
  const errResult = validate(errJson);
  p(JSON.stringify(errResult, null, 2));

  // ..............................................
  h1('Table name starts with underscore? No error is returned.');
  const ignoredJson: Rljson = {
    _tableOne: { _type: 'properties', _data: [] },
    tableTwo: { _type: 'properties', _data: [] },
  };
  const ignoredResult = validate(ignoredJson);
  p(JSON.stringify(ignoredResult, null, 2));
};
