// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Rljson } from '@rljson/format';
import { RljsonTable } from '@rljson/format/dist/rljson.js';
import { Json } from '@rljson/json';

// .............................................................................
export interface Errors {
  tableNamesAreLowerCamelCase?: Json;
  columnNamesAreLowerCamelCase?: Json;
}

// .............................................................................
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
   * @returns Returns 'ok' if there are no errors,
   * otherwise an object with the errors.
   */
  get result(): Errors {
    const errors = {};

    this._tableNamesAreLowerCamelCase(errors);
    this._columnNamesAreLowerCamelCase(errors);

    return errors;
  }

  // ######################
  // Private
  // ######################
  private _tableNamesAreLowerCamelCase(errors: Json): void {
    const invalidTableNames: string[] = [];

    for (const tableName in this.rljson) {
      if (tableName.startsWith('_')) {
        continue;
      }

      if (!/^[a-z][a-zA-Z0-9]*$/.test(tableName)) {
        invalidTableNames.push(tableName);
      }
    }

    if (invalidTableNames.length > 0) {
      errors.tableNamesAreLowerCamelCase = {
        error: 'Table names must be lower camel case',
        invalidTableNames: invalidTableNames,
      };
    }
  }

  // ...........................................................................

  private _columnNamesAreLowerCamelCase(errors: Json): void {
    const invalidColumnNames: {
      [tableName: string]: string[];
    } = {};

    let hadErrors = false;

    for (const tableName in this.rljson) {
      if (tableName.startsWith('_')) {
        continue;
      }

      const table = this.rljson[tableName] as RljsonTable<any, any>;
      for (const row of table._data) {
        for (const columnName in row) {
          if (columnName.startsWith('_')) {
            continue;
          }

          if (!/^[a-z][a-zA-Z0-9]*$/.test(columnName)) {
            invalidColumnNames[tableName] ??= [];
            invalidColumnNames[tableName].push(columnName);
            hadErrors = true;
          }
        }
      }
    }

    if (hadErrors) {
      errors.columnNamesAreLowerCamelCase = {
        error: 'Column names must be lower camel case',
        invalidColumnNames: invalidColumnNames,
      };
    }
  }
}

/**
 * Validates an rljson object
 * @param rljson - The rljson object to validate
 * @returns The result of the validation
 */
export const validate = (rljson: Rljson): Errors => {
  return new Validate(rljson).result;
};
