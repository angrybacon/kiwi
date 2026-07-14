import { describe, expect, it } from 'vitest';

import { makeToc } from './makeToc';

describe(makeToc, () => {
  it('should return an empty object for content without headings', () => {
    // Given
    const content = 'Just a paragraph.';
    // When
    const result = makeToc(content);
    // Then
    expect(result).toEqual({});
  });

  it('should nest headings', () => {
    // Given
    const content = '# A\n\n## B';
    // When
    const result = makeToc(content);
    // Then
    expect(result).toEqual({
      items: [
        {
          items: [{ title: 'B', url: '#b' }],
          title: 'A',
          url: '#a',
        },
      ],
    });
  });

  it('should handle deeply nested headings', () => {
    // Given
    const content = '# A\n\n## B\n\n### C\n\n#### D';
    // When
    const result = makeToc(content);
    // Then
    expect(result).toEqual({
      items: [
        {
          items: [
            {
              items: [
                {
                  items: [{ title: 'D', url: '#d' }],
                  title: 'C',
                  url: '#c',
                },
              ],
              title: 'B',
              url: '#b',
            },
          ],
          title: 'A',
          url: '#a',
        },
      ],
    });
  });

  it('should parse a flat list of headings', () => {
    // Given
    const content = '## A\n\n## B\n\n## C';
    // When
    const result = makeToc(content);
    // Then
    expect(result).toEqual({
      items: [
        { title: 'A', url: '#a' },
        { title: 'B', url: '#b' },
        { title: 'C', url: '#c' },
      ],
    });
  });
});
