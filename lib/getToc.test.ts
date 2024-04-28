import { getToc } from './getToc.ts';

const makeMarkdown = (...headings: string[]) => headings.join('\n\n');

describe(getToc.name, () => {
  it('should return a table of content', () => {
    // Given
    const markdown = makeMarkdown('# One', '# Two', '# Three');
    // When
    const result = getToc(markdown);
    // Then
    expect(result).toEqual({
      items: [
        { title: 'One', url: '#one' },
        { title: 'Two', url: '#two' },
        { title: 'Three', url: '#three' },
      ],
    });
  });
});
