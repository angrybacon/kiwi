import { describe, expect, it } from 'vitest';

import { trimOrderPrefix } from './trimOrderPrefix';

describe(trimOrderPrefix, () => {
  it.each(
    // prettier-ignore
    [
    ['0-lorem-ipsum',     'lorem-ipsum'],
    ['1-lorem-ipsum',     'lorem-ipsum'],
    ['01-lorem-ipsum',    'lorem-ipsum'],
    ['123-lorem-ipsum',   'lorem-ipsum'],
    ['0123-lorem-ipsum',  'lorem-ipsum'],
    ['01-02-lorem-ipsum', '02-lorem-ipsum'],
    ['lorem-ipsum',       'lorem-ipsum'],
    ['01lorem-ipsum',     '01lorem-ipsum'],
    ['',                  ''],
    ['  ',                '  '],
  ],
  )('should trim "%s" into "%s"', (input, expected) => {
    // When
    const result = trimOrderPrefix(input);
    // Then
    expect(result).toBe(expected);
  });
});
