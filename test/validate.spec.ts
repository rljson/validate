// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { describe, expect, it } from 'vitest';

import { validate } from '../src/validate';

describe('Validate', () => {
  describe('tableNamesAreLowerCamelCase()', () => {
    describe('returns no errors', () => {
      describe('when all table names have camel case fields', () => {
        it('for an empy rljson object', () => {
          const r = validate({});
          expect(r).toEqual({});
        });

        it('for an rljson object with valid table names', () => {
          const r = validate({
            tableOne: { _type: 'properties', _data: [] },
            tableTwo: { _type: 'properties', _data: [] },
          });
          expect(r).toEqual({});
        });
      });

      it('when private keys are like _type or _hash are contained', () => {
        const r = validate({
          _type: 'properties',
          _hash: 'ABC',
        });
        expect(r).toEqual({});
      });
    });

    describe('returns an error JSON', () => {
      it('when a table name starts with a number', () => {
        const r = validate({
          '1table': { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: ['1table'],
        });
      });
      it('when a table name contains a space', () => {
        const r = validate({
          'table one': { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: ['table one'],
        });
      });

      it('when a table name contains a dash', () => {
        const r = validate({
          'table-one': { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: ['table-one'],
        });
      });

      it('when a table name contains an underscore', () => {
        const r = validate({
          table_one: { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: ['table_one'],
        });
      });

      it('when a table name contains a capital letter', () => {
        const r = validate({
          TableOne: { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: ['TableOne'],
        });
      });

      it('when multiple table names are invalid', () => {
        const r = validate({
          '1table': { _type: 'properties', _data: [] },
          'table one': { _type: 'properties', _data: [] },
          'table-one': { _type: 'properties', _data: [] },
          table_one: { _type: 'properties', _data: [] },
          TableOne: { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: [
            '1table',
            'table one',
            'table-one',
            'table_one',
            'TableOne',
          ],
        });
      });

      it('when a table name is an empty string', () => {
        const r = validate({
          '': { _type: 'properties', _data: [] },
        });
        expect(r.tableNamesAreLowerCamelCase).toEqual({
          error: 'Table names must be lower camel case',
          invalidTableNames: [''],
        });
      });
    });
  });

  describe('columnNamesAreLowerCamelCase()', () => {
    describe('returns "ok"', () => {
      it('when all column names have camel case fields', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ columnOne: 123 }] },
          tableTwo: { _type: 'properties', _data: [{ columnTwo: 456 }] },
        });
        expect(r).toEqual({});
      });

      it('when private keys are like _type or _hash are contained', () => {
        const r = validate({
          tableOne: {
            _type: 'properties',
            _data: [{ _type: 123, _hash: 456 }],
          },
        });
        expect(r).toEqual({});
      });
    });

    describe('returns an error JSON', () => {
      it('when a column name starts with a number', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ '1column': 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: ['1column'] },
        });
      });

      it('when a column name contains a space', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ 'column one': 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: ['column one'] },
        });
      });

      it('when a column name contains a dash', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ 'column-one': 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: ['column-one'] },
        });
      });

      it('when a column name contains an underscore', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ column_one: 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: ['column_one'] },
        });
      });

      it('when a column name contains a capital letter', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ ColumnOne: 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: ['ColumnOne'] },
        });
      });

      it('when multiple column names are invalid', () => {
        const r = validate({
          tableOne: {
            _type: 'properties',
            _data: [
              { '1column': 123, 'column one': 456, 'column-one': 789 },
              { column_one: 101, ColumnOne: 202 },
            ],
          },

          tableTwo: {
            _type: 'properties',
            _data: [{ '1xyz': 123 }, { xy_38: 101 }],
          },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: {
            tableOne: [
              '1column',
              'column one',
              'column-one',
              'column_one',
              'ColumnOne',
            ],
            tableTwo: ['1xyz', 'xy_38'],
          },
        });
      });

      it('when a column name is an empty string', () => {
        const r = validate({
          tableOne: { _type: 'properties', _data: [{ '': 123 }] },
        });
        expect(r.columnNamesAreLowerCamelCase).toEqual({
          error: 'Column names must be lower camel case',
          invalidColumnNames: { tableOne: [''] },
        });
      });
    });
  });
});
