import { readFileSync } from 'fs';
import { vol } from 'memfs';

import { walkDirectory } from './walk.ts';

jest.mock('fs', () => require('memfs'));

describe(walkDirectory.name, () => {
  describe('Basic', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          'a/a.md': 'Content',
          'a/b.txt': '',
          'a/c.md': '',
          'b/a/b.txt': '',
          'b/c/d.txt': '',
          'c.d/d/e/f.md': '',
          'empty.d': null,
        },
        '/',
      );
    });

    it('should use the mocked file system', () => {
      // When
      const result = readFileSync('/a/a.md', { encoding: 'utf8' });
      // Then
      expect(result).toEqual('Content');
    });

    it('should build the complete root structure', () => {
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

    it('should build an empty array when the directory is empty', () => {
      // When
      const result = walkDirectory('/empty.d');
      // Then
      expect(result).toEqual([]);
    });

    it('should build an empty array when the directory does not exist', () => {
      // When
      const result = walkDirectory('/does/not/exist');
      // Then
      expect(result).toEqual([]);
    });
  });

  describe('Extension', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          'a/a.md': '',
          'a/b.txt': '',
          'a/c.md': '',
          'b/a/b.txt': '',
          'b/c/d.txt': '',
          'c.d/d/e/f.md': '',
        },
        '/',
      );
    });

    it('should match all files by default', () => {
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

    it('should match text files when specified', () => {
      // When
      const result = walkDirectory('/', { extension: '.txt' });
      // Then
      expect(result).toEqual([
        ['a', 'b'],
        ['b', 'a', 'b'],
        ['b', 'c', 'd'],
      ]);
    });
  });

  describe('Depth', () => {
    beforeEach(() => {
      vol.fromJSON(
        {
          'a/a.md': '',
          'a/b.txt': '',
          'a/c.md': '',
          'b/a/b.txt': '',
          'b/c/d.txt': '',
          'c.d/d/e/f.md': '',
        },
        '/',
      );
    });

    it('should walk the complete tree by default', () => {
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

    it('should walk down to the specified depth', () => {
      // When
      const result = walkDirectory('/', { depth: 2 });
      // Then
      expect(result).toEqual([
        ['a', 'a'],
        ['a', 'b'],
        ['a', 'c'],
      ]);
    });
  });
});
