import { readFileSync } from 'fs';
import { vol } from 'memfs';

import { walk, walkDirectory } from './walk.ts';

jest.mock('fs', () => require('memfs'));

describe.only(walk.name, () => {
  beforeEach(() => {
    vol.reset();
  });

  describe(walkDirectory.name, () => {
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
      const result = walkDirectory('/');
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
      const result = walkDirectory('/', '.txt');
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
      const result = walkDirectory('/empty.d');
      // Then
      expect(result).toEqual([]);
    });

    it('should yield an empty array when the directory does not exist', () => {
      // When
      const result = walkDirectory('/does/not/exist');
      // Then
      expect(result).toEqual([]);
    });
  });

  it('should yield well-formed routes with the provided names', () => {
    // Given
    vol.fromJSON(
      {
        'a/a/a.md': '',
        'a/b/b.md': '',
        'a/c/c.md': '',
        'b/a/a.md': '',
        'b/b/b.md': '',
        'c/a/a.md': '',
      },
      '/',
    );
    // When
    const result = walk('/', ['one', 'two', 'three']);
    // Then
    expect(result).toEqual([
      { one: 'a', two: 'a', three: 'a' },
      { one: 'a', two: 'b', three: 'b' },
      { one: 'a', two: 'c', three: 'c' },
      { one: 'b', two: 'a', three: 'a' },
      { one: 'b', two: 'b', three: 'b' },
      { one: 'c', two: 'a', three: 'a' },
    ]);
  });

  it('should error if the file system does not match the expected depth', () => {
    // Given
    vol.fromJSON(
      {
        'a/a/a.md': '',
        'a/b/b.md': '',
        'a/c/c.md': '',
        'b/a.md': '',
        'b/b.md': '',
        'c/a/a.md': '',
      },
      '/',
    );
    // When
    const f = () => walk('/', ['parent', 'child']);
    // Then
    expect(f).toThrow(/Found orphan.+expected depth of 2/);
  });

  it('should remove the prefix when provided', () => {
    // Given
    vol.fromJSON(
      {
        'a/01-a.md': '',
        'a/02-b.md': '',
        'a/03-c.md': '',
        'b/01-a.md': '',
        'b/02-b.md': '',
        'c/a.md': '',
      },
      '/',
    );
    // When
    const result = walk('/', ['one', 'two'], { prefix: /^\d+-/ });
    // Then
    expect(result).toEqual([
      { one: 'a', two: 'a' },
      { one: 'a', two: 'b' },
      { one: 'a', two: 'c' },
      { one: 'b', two: 'a' },
      { one: 'b', two: 'b' },
      { one: 'c', two: 'a' },
    ]);
  });
});
