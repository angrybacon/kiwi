import { makeNextRoutes } from './makeNextRoutes.ts';

describe(makeNextRoutes.name, () => {
  it('should yield well-formed routes with the provided names', () => {
    // Given
    const paths = [
      ['a', 'a', 'a'],
      ['a', 'b', 'b'],
      ['a', 'c', 'c'],
      ['b', 'a', 'a'],
      ['b', 'b', 'b'],
      ['c', 'a', 'a'],
    ];
    // When
    const result = makeNextRoutes(paths, ['one', 'two', 'three']);
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
    const paths = [
      ['a', 'a', 'a'],
      ['a', 'b', 'b'],
      ['a', 'c', 'c'],
      ['b', 'a'],
      ['b', 'b'],
      ['c', 'a', 'a'],
    ];
    // When
    const f = () => makeNextRoutes(paths, ['one', 'two']);
    // Then
    expect(f).toThrow(/Found orphan.+expected depth of 2/);
  });

  it('should trim digit prefixes', () => {
    // Given
    const paths = [
      ['01-a', 'a', '01-a'],
      ['01-a', '01-b', 'b'],
      ['01-a', 'c', 'c'],
      ['02-b', 'a', 'a'],
      ['02-b', 'b', 'b'],
      ['c', '01-a', '01-a'],
    ];
    // When
    const result = makeNextRoutes(paths, ['one', 'two', 'three']);
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
});
