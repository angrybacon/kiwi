import { makeMenu } from './makeMenu.ts';

describe(makeMenu.name, () => {
  it('should return menu entries', () => {
    // Given
    const paths = [
      ['a', 'a'],
      ['a', 'b'],
      ['b', 'a'],
      ['b', 'b'],
    ] as const satisfies [string, string][];
    // When
    const result = makeMenu(paths);
    // Then
    expect(result).toEqual([
      [
        'a',
        [
          { label: 'a', path: '/a/a' },
          { label: 'b', path: '/a/b' },
        ],
      ],
      [
        'b',
        [
          { label: 'a', path: '/b/a' },
          { label: 'b', path: '/b/b' },
        ],
      ],
    ]);
  });
});
