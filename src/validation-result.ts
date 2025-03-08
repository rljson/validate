// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import { Json } from '@rljson/json';

/**
 * The result of a validation
 */
export interface ValidationResult extends Json {
  /** Returns true when all talbe names are lower camel case */
  tableNamesAreLowerCamelCase: SingleResult;
}

/**
 * The result of a single test
 */
export type SingleResult = 'ok' | Json;
