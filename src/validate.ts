// @license
// Copyright (c) 2025 Rljson
//
// Use of this source code is governed by terms that can be
// found in the LICENSE file in the root of this package.

import {
  BaseValidator,
  Rljson,
  Validate,
  ValidationResult,
} from '@rljson/rljson';

/**
 * Validates an rljson object
 * @param rljson - The rljson object to validate
 * @returns The result of the validation
 */
export const validate = async (rljson: Rljson): Promise<ValidationResult> => {
  const result = new Validate();
  result.addValidator(new BaseValidator());
  return await result.run(rljson);
};
