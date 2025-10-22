import { describe, expect, it } from 'vitest';

import { makePaths } from './makePaths.ts';

describe(makePaths.name, () => {
  it('should yield well-formed crumbs from the provided tree', () => {
    // Given
    const paths: [chapter: string, slug: string][] = [
      ['a', 'a'],
      ['a', 'b'],
      ['a', 'c'],
      ['b', 'a'],
      ['b', 'b'],
      ['c', 'a'],
    ];
    // When
    const result = makePaths(paths);
    // Then
    expect(result).toEqual({
      a: { a: ['a', 'a.md'], b: ['a', 'b.md'], c: ['a', 'c.md'] },
      b: { a: ['b', 'a.md'], b: ['b', 'b.md'] },
      c: { a: ['c', 'a.md'] },
    });
  });

  it('should trim the digit prefixes in the dictionary keys', () => {
    // Given
    const paths: [chapter: string, slug: string][] = [
      ['01-a', '01-a'],
      ['01-a', 'b'],
      ['01-a', 'c'],
      ['02-b', '01-a'],
      ['02-b', '02-b'],
      ['03-c', 'a'],
    ];
    // When
    const result = makePaths(paths);
    // Then
    expect(result).toEqual({
      a: { a: ['01-a', '01-a.md'], b: ['01-a', 'b.md'], c: ['01-a', 'c.md'] },
      b: { a: ['02-b', '01-a.md'], b: ['02-b', '02-b.md'] },
      c: { a: ['03-c', 'a.md'] },
    });
  });

  it('should not sort the entries', () => {
    // Given
    const paths: [chapter: string, slug: string][] = [
      ['02-a', '01-a'],
      ['02-a', 'b'],
      ['02-a', 'c'],
      ['01-b', '02-a'],
      ['01-b', '01-b'],
      ['03-c', 'a'],
    ];
    // When
    const result = makePaths(paths);
    // Then
    expect(result).toEqual({
      a: { a: ['02-a', '01-a.md'], b: ['02-a', 'b.md'], c: ['02-a', 'c.md'] },
      b: { a: ['01-b', '02-a.md'], b: ['01-b', '01-b.md'] },
      c: { a: ['03-c', 'a.md'] },
    });
  });
});
