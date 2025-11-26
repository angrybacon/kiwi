import { readFileSync } from 'node:fs';
import { vol } from 'memfs';
import type { Plugin } from 'unified';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { read } from './read.ts';

vi.mock('node:fs', () => require('memfs'));

describe(read.name, () => {
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

  it('should read Markdown when provided an absolute path', async () => {
    // Given
    vol.fromJSON({ 'a/a.md': '# Title' }, '/');
    // When
    const result = await read('/a/a.md');
    // Then
    expect(result).toEqual({
      data: {},
      matter: {},
      minutes: '0',
      path: '/a/a.md',
      text: '# Title\n',
    });
  });

  it('should read Markdown when provided an array of crumbs', async () => {
    // Given
    vol.fromJSON({ 'a/a.md': '# Title' }, '/');
    // When
    const result = await read({ crumbs: ['a', 'a'], root: '/' });
    // Then
    expect(result).toEqual({
      data: {},
      matter: {},
      minutes: '0',
      path: '/a/a.md',
      text: '# Title\n',
    });
  });

  it('should incorporate and run custom plugins', async () => {
    // Given
    vol.fromJSON({ 'a/a.md': '# Title' }, '/');
    const one = vi.fn().mockImplementation((() => async (_tree, file) => {
      file.data.one = 'One';
    }) satisfies Plugin);
    const two = vi.fn().mockImplementation((() => async (_tree, file) => {
      file.data.two = 'Two';
    }) satisfies Plugin);
    // When
    const result = await read('/a/a.md', one, two);
    // Then
    expect(one).toHaveBeenCalledTimes(1);
    expect(result.data.one).toEqual('One');
    expect(two).toHaveBeenCalledTimes(1);
    expect(result.data.two).toEqual('Two');
  });

  it('should read the Markdown matter', async () => {
    // Given
    vol.fromJSON(
      {
        'a/a.md': `---
one: One
two: Two
---
# Title`,
      },
      '/',
    );
    // When
    const result = await read('/a/a.md');
    // Then
    expect(result).toEqual({
      data: {},
      matter: { one: 'One', two: 'Two' },
      minutes: '0',
      path: '/a/a.md',
      text: '# Title\n',
    });
  });
});
