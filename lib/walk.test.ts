import { readFileSync } from 'fs';
import { vol } from 'memfs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { walk } from './walk.ts';

vi.mock('node:fs', () => require('memfs'));

describe(walk.name, () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should use the mocked file system', () => {
    // Given
    vol.fromJSON({ 'a/a.md': 'Content' }, '/');
    // When
    const result = readFileSync('/a/a.md', { encoding: 'utf8' });
    // Then
    expect(result).toEqual('Content');
  });

  it('should list all files by default', () => {
    // Given
    vol.fromJSON(
      {
        'a/a.md': '',
        'a/b.txt': '',
        'a/c.md': '',
        'b/a/b.txt': '',
        'b/c/d.txt': '',
        'c.d/d/e/f.md': '',
        'empty.d': null,
      },
      '/',
    );
    // When
    const result = walk('/');
    // Then
    expect(result).toEqual([
      ['a', 'a'],
      ['a', 'b'],
      ['a', 'c'],
      ['b', 'a', 'b'],
      ['b', 'c', 'd'],
      ['c.d', 'd', 'e', 'f'],
    ]);
  });

  it('should only list text files when specified', () => {
    // Given
    vol.fromJSON(
      {
        'a/a.md': '',
        'a/b.txt': '',
        'a/c.md': '',
        'b/a/b.txt': '',
        'b/c/d.txt': '',
        'c.d/d/e/f.md': '',
        'empty.d': null,
      },
      '/',
    );
    // When
    const result = walk('/', { extension: '.txt' });
    // Then
    expect(result).toEqual([
      ['a', 'b'],
      ['b', 'a', 'b'],
      ['b', 'c', 'd'],
    ]);
  });

  it('should yield an empty array when the directory is empty', () => {
    // Given
    vol.fromJSON({ 'empty.d': null }, '/');
    // When
    const result = walk('/empty.d');
    // Then
    expect(result).toEqual([]);
  });

  it('should yield an empty array when the directory does not exist', () => {
    // When
    const result = walk('/does/not/exist');
    // Then
    expect(result).toEqual([]);
  });

  it('should sort the files by directory', () => {
    // Given
    vol.fromJSON(
      {
        'a/a.md': '',
        'a/02-b.txt': '',
        'a/01-c.md': '',
        '01-b/a/b.txt': '',
        '01-b/c/d.txt': '',
        'c.d/03-d/02-e/01-f.md': '',
      },
      '/',
    );
    // When
    const result = walk('/');
    // Then
    expect(result).toEqual([
      ['01-b', 'a', 'b'],
      ['01-b', 'c', 'd'],
      ['a', '01-c'],
      ['a', '02-b'],
      ['a', 'a'],
      ['c.d', '03-d', '02-e', '01-f'],
    ]);
  });
});
