/* eslint no-confusing-arrow: 0 */
/**
 * Talisman phonetics/french/sonnex
 * =================================
 *
 * Implementation of the French phonetic algorithm "Sonnex".
 *
 * [Author]: Frédéric Bisson
 *
 * [Reference]:
 * https://github.com/Zigazou/Sonnex
 */
import {SINGLE_QUOTES} from '../../regex/classes';

/**
 * Helpers.
 */
const VOWELS = new Set('aâàäeéèêëiîïoôöuùûüyœ'),
      CONSONANTS = new Set('bcçdfghjklmnpqrstvwxyz');

const DROP_SINGLE_QUOTES = new RegExp('[' + SINGLE_QUOTES + ']', 'g');

function isVowel(letter) {
  return VOWELS.has(letter);
}

function isConsonant(letter) {
  return CONSONANTS.has(letter);
}

/**
 * Rules.
 */
const EXCEPTIONS = {
  cerf: 'sEr',
  cerfs: 'sEr',
  de: 'de',
  est: 'E',
  es: 'E',
  huit: 'uit',
  les: 'lE',
  mer: 'mEr',
  mes: 'mE',
  ressent: 'res2',
  serf: 'sEr',
  serfs: 'sEr',
  sept: 'sEt',
  septième: 'sEtiEm',
  ses: 'sE',
  test: 'tE'
};

// TODO: check null simplification
const RULES = {
  a: [
    [/^ais(\w|$)/, letter => {
      if (letter === 'z')
        return 'Ez';
      return 'Es';
    }],
    [/^(aient|ais)/, 'E'],
    [/^ain(.)/, letter => isVowel(letter) ? 'E' : '1'],
    [/^aill?/, 'ai'],
    [/^ai/, 'E'],
    [/^amm/, 'am'],
    [/^am(.|$)/, letter => letter === 'm' || isVowel(letter) ? 'am' : 2],
    [/^an(.|$)/, letter => {
      if (letter === 'n')
        return 'an';
      if (letter === 't')
        return '2t';
      if (isVowel(letter))
        return 'an';
      return '2';
    }],
    [/^assent/, 'as'],
    [/^as(.|$)/, letter => {
      if (isConsonant(letter))
        return 'as';
      return 'az';
    }],
    [/^au/, 'o'],
    [/^ays?$/, 'E'],
    [null, 'a']
  ]
};

/**
 * Function taking a single word and computing its Sonnex code.
 *
 * @param  {string}  word - The word to process.
 * @return {string}       - The Sonnex code.
 *
 * @throws {Error} The function expects the word to be a string.
 */
export default function sonnex(word) {
  if (typeof word !== 'string')
    throw Error('talisman/phonetics/french/sonnex: the given word is not a string.');

  let code = word
    .toLowerCase()
    .replace(DROP_SINGLE_QUOTES, '');

  // Some exceptions
  const exception = EXCEPTIONS[word];

  if (exception)
    return exception;
}