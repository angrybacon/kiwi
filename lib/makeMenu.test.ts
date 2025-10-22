import { describe, expect, it } from 'vitest';

import { makeMenu } from './makeMenu.ts';

describe(makeMenu.name, () => {
  it('should return menu entries', () => {
    // Given
    const cards = [
      { category: 'ONE', title: 'Title A' },
      { category: 'TWO', subtitle: 'Subtitle A', title: 'Title A' },
      { category: 'TWO', subtitle: 'Subtitle B', title: 'Title B' },
      { category: 'TWO', title: 'Title C' },
      { category: 'THREE', title: 'Title A' },
      { category: 'THREE', title: 'Title B' },
    ];
    // When
    const result = makeMenu(cards);
    // Then
    expect(result).toEqual([
      {
        id: 'ONE',
        pages: [{ category: 'ONE', title: 'Title A' }],
      },
      {
        id: 'TWO',
        pages: [
          { category: 'TWO', subtitle: 'Subtitle A', title: 'Title A' },
          { category: 'TWO', subtitle: 'Subtitle B', title: 'Title B' },
          { category: 'TWO', title: 'Title C' },
        ],
      },
      {
        id: 'THREE',
        pages: [
          { category: 'THREE', title: 'Title A' },
          { category: 'THREE', title: 'Title B' },
        ],
      },
    ]);
  });

  it('should not alter the input order', () => {
    // Given
    const cards = [
      { category: 'TWO', title: 'Title C' },
      { category: 'THREE', title: 'Title A' },
      { category: 'TWO', subtitle: 'Subtitle B', title: 'Title B' },
      { category: 'TWO', subtitle: 'Subtitle A', title: 'Title A' },
      { category: 'ONE', title: 'Title A' },
      { category: 'THREE', title: 'Title B' },
    ];
    // When
    const result = makeMenu(cards);
    // Then
    expect(result).toEqual([
      {
        id: 'TWO',
        pages: [
          { category: 'TWO', title: 'Title C' },
          { category: 'TWO', subtitle: 'Subtitle B', title: 'Title B' },
          { category: 'TWO', subtitle: 'Subtitle A', title: 'Title A' },
        ],
      },
      {
        id: 'THREE',
        pages: [
          { category: 'THREE', title: 'Title A' },
          { category: 'THREE', title: 'Title B' },
        ],
      },
      {
        id: 'ONE',
        pages: [{ category: 'ONE', title: 'Title A' }],
      },
    ]);
  });
});
