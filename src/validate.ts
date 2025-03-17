// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Hash } from '@rljson/hash';
import { Json } from '@rljson/json';
import { Rljson, RljsonTable } from '@rljson/rljson';

// .............................................................................
export interface Errors {
  tableNamesAreLowerCamelCase?: Json;
  columnNamesAreLowerCamelCase?: Json;
  tableNamesDoNotStartWithANumber?: Json;

  hasValidHashes?: Json;
  hasErrors: boolean;
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
   * Validates the rljson object and returns an errors object
   */
  get result(): Errors {
    const errors: any = {};

    this._tableNamesAreLowerCamelCase(errors);
    this._tableNamesDoNotStartWithNumber(errors);
    this._columnNamesAreLowerCamelCase(errors);
    this._hasValidHashes(errors);
    errors.hasErrors = Object.keys(errors).length > 0;

    return errors as Errors;
  }

  static isValidFieldName(fieldName: string): boolean {
    return /^[a-z][a-zA-Z0-9]*$/.test(fieldName);
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

      if (!Validate.isValidFieldName(tableName)) {
        invalidTableNames.push(tableName);
      }
    }

    if (invalidTableNames.length > 0) {
      errors.tableNamesAreLowerCamelCase = {
        error: 'Table names must be lower camel case',
        tables: invalidTableNames,
      };
    }
  }

  // ...........................................................................
  private _tableNamesDoNotStartWithNumber(errors: Json): void {
    const invalidTableNames: string[] = [];

    for (const tableName in this.rljson) {
      if (tableName.startsWith('_')) {
        continue;
      }

      if (/^[0-9]/.test(tableName)) {
        invalidTableNames.push(tableName);
      }
    }

    if (invalidTableNames.length > 0) {
      errors.tableNamesDoNotStartWithANumber = {
        error: 'Table names must not start with a number',
        tables: invalidTableNames,
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

          if (!Validate.isValidFieldName(columnName)) {
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

  // ...........................................................................
  private _hasValidHashes(errors: Json): void {
    try {
      Hash.default.validate(this.rljson, { ignoreMissingHashes: true });
    } catch (error: any) {
      if (error instanceof Error) {
        errors.hasValidHashes = {
          error: error.message,
        };
        /* v8 ignore start */
      } else {
        errors.hasValidHashes = {
          error: 'Unknown error',
        };
      }
      /* v8 ignore stop */
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

/**
 * Validates an field name
 * @param fieldName - The field name to validate
 * @returns true if the field name is valid, false otherwise
 */
export const isValidFieldName = (fieldName: string): boolean =>
  Validate.isValidFieldName(fieldName);
