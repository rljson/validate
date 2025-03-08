// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Rljson } from '@rljson/format';

import { SingleResult, ValidationResult } from './validation-result.ts';

/**
 * The main class of the package
 */
export class Validate {
  /**
   * Constructor
   * @param rljson - The rljson object to validate
   */
  constructor(public readonly rljson: Rljson) {}

  /**
   * Validates the rljson object
   * @returns The result of the validation
   */
  get result(): ValidationResult {
    return {
      tableNamesAreLowerCamelCase: this._tableNamesAreLowerCamelCase,
    };
  }

  // ######################
  // Private
  // ######################
  get _tableNamesAreLowerCamelCase(): SingleResult {
    const invalidTableNames: string[] = [];

    for (const tableName of Object.keys(this.rljson)) {
      if (!/^[a-z][a-zA-Z0-9]*$/.test(tableName)) {
        invalidTableNames.push(tableName);
      }
    }

    return invalidTableNames.length === 0
      ? 'ok'
      : {
          error: 'Table names must be lower camel case',
          invalidTableNames: invalidTableNames,
        };
  }
}

/**
 * Validates an rljson object
 * @param rljson - The rljson object to validate
 * @returns The result of the validation
 */
export const validate = (rljson: Rljson): ValidationResult => {
  return new Validate(rljson).result;
};
