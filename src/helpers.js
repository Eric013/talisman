/**
 * Talisman helpers
 * =================
 *
 * Miscellaneous helper functions.
 */

/**
 * Function normalizing the given variable into a proper array sequence.
 *
 * @param  {mixed} target - The variable to normalize as a sequence.
 * @return {array}        - The resulting sequence.
 */
export function seq(target) {
  return typeof target === 'string' ? target.split('') : target;
}

/**
 * Function squeezing the given sequence by dropping consecutive duplicates.
 *
 * Note: the name was actually chosen to mimic Ruby's naming since I did not
 * find any equivalent in other standard libraries.
 *
 * @param  {mixed} target - The sequence to squeeze.
 * @return {array}        - The resulting sequence.
 */
export function squeeze(target) {
  const isString = typeof target === 'string',
        sequence = seq(target),
        squeezed = [];

  for (let i = 0, l = sequence.length, memo = null; i < l; i++) {
    if (sequence[i] !== memo) {
      memo = sequence[i];
      squeezed.push(memo);
    }
  }

  return isString ? squeezed.join('') : squeezed;
}
