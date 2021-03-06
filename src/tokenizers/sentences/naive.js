/**
 * Talisman tokenizers/sentences/naive
 * ====================================
 *
 * Naive rule-based sentence tokenizer.
 *
 * [Author]: Guillaume PLIQUE
 */
import {SINGLE_QUOTES, DOUBLE_QUOTES} from '../../regexp/classes';

/**
 * Notable exceptions.
 */
const EXCEPTIONS = [
  'Dr',
  'etc',
  'Jr',
  'M',
  'Mgr',
  'Mr',
  'Mrs',
  'Ms',
  'Mme',
  'Mlle',
  'Prof',
  'Sr',
  'St'
];

/**
 * Building the splitting regex.
 */
const REGEX = new RegExp([
  '([.?!…]+)',
    '([' + DOUBLE_QUOTES + '*_]?[*_]?)',
    '[\\s\\r\\n]+',
  '(?=[' + DOUBLE_QUOTES + SINGLE_QUOTES + ']?[A-Z0-9])'
].join(''), 'g');

/**
 * Building additional regexes.
 */
const DOUBLE_QUOTES_REGEX = new RegExp('[' + DOUBLE_QUOTES + ']', 'g'),
      PAREN_REGEX = /[(){}\[\]]/g,
      LIST_REGEX = /^[A-Z0-9]\s?[.]\s*$/,
      PITFALL_REGEX = /^[A-Za-z0-9]\s*\)/;

/**
 * Tokenizer function factory aiming at building the required function.
 *
 * @param  {object}   options              - Possible options:
 * @param  {object}   [options.exceptions] - List of exceptions to handle.
 * @return {function}                      - The tokenizer function.
 */
export function createTokenizer(options) {
  options = options || {};

  const exceptions = options.exceptions || [];

  // Building the exception regex once and for all
  const exceptionsRegex = new RegExp(
    `(${exceptions.map(e => e + '\\.').join('|')})`
  );

  /**
   * Created tokenizer function.
   *
   * @param  {string} text - The text to tokenize.
   * @return {array}       - The sentences as tokens.
   */
  return function(text) {
    const initialTokens = text.replace(REGEX, '$1$2\x1E').split('\x1E'),
          correctTokens = [];

    let memo = '',
        c;

    for (let i = 0, l = initialTokens.length; i < l; i++) {
      c = initialTokens[i];

      // Searching for exceptions
      if (i !== l - 1 &&
          ((exceptionsRegex.test(c)) ||
           (LIST_REGEX.test(c)) ||
           (!PITFALL_REGEX.test(c)) &&
           ((((memo + c).match(DOUBLE_QUOTES_REGEX) || []).length % 2 !== 0) ||
            (((memo + c).match(PAREN_REGEX) || []).length % 2 !== 0)))) {
        memo += (memo ? ' ' : '') + c;
        continue;
      }

      correctTokens.push(memo + (c && memo ? ' ' : '') + c);
      memo = '';
    }

    return correctTokens;
  };
}

/**
 * Exporting a default version of the tokenizer.
 */
const defaultTokenizer = createTokenizer({exceptions: EXCEPTIONS});
export default defaultTokenizer;
