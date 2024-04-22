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

  it('should error if a path has less than 2 crumbs', () => {
    // Given
    const paths = [['a'], ['b', 'a'], ['b', 'b']];
    // When
    // @ts-expect-error Force value for testing purposes
    const f = () => makeMenu(paths);
    // Then
    expect(f).toThrow('Expect depth of 2 but got "a"');
  });

  it('should error if a path has less than 2 crumbs', () => {
    // Given
    const paths = [
      ['a', 'a'],
      ['a', 'b', 'c'],
      ['b', 'a'],
      ['b', 'b'],
    ];
    // When
    // @ts-expect-error Force value for testing purposes
    const f = () => makeMenu(paths);
    // Then
    expect(f).toThrow('Expect depth of 2 but got "a,b,c"');
  });

  it('should trim digit prefixes', () => {
    // Given
    const paths = [
      ['01-a', 'a'],
      ['01-a', 'b'],
      ['b', '01-a'],
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
