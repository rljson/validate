import { Validate } from './validate.ts';

/**
 * The example function demonstrates how the package works
 */
export const example = () => {
  const print = console.log;
  const assert = console.assert;

  const validate = new Validate();
  print(validate.validate());
  assert(validate.validate() === 'bar');
};
