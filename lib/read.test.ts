import { read } from './read.ts';
import { readFileSync } from 'node:fs';

jest.mock('node:fs');

const makeMarkdown = (...paragraphs: string[][]): string =>
  paragraphs.map((paragraph) => paragraph.join('\n')).join('\n\n');

describe(read.name, () => {
  it('should read the file at the provided path', () => {
    // Given
    jest.mocked(readFileSync).mockReturnValueOnce('');
    // When
    read('one', 'two', 'markdown.md');
    // Then
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringMatching('/one/two/markdown.md$'),
      'utf8',
    );
  });

  it('should read a Markdown file', () => {
    // Given
    const text = makeMarkdown(['Paragraph one.'], ['Paragraph two.']);
    jest.mocked(readFileSync).mockReturnValueOnce(text);
    // When
    const result = read('markdown.md');
    // Then
    expect(result).toEqual({
      matter: {},
      minutes: 1,
      title: undefined,
      text,
    });
  });

  it('should read the frontmatter', () => {
    // Given
    const text = makeMarkdown(
      ['---', 'banner: BANNER', 'title: Title', '---'],
      ['Paragraph one.'],
      ['Paragraph two.'],
    );
    jest.mocked(readFileSync).mockReturnValueOnce(text);
    // When
    const result = read('markdown.md');
    // Then
    expect(result).toEqual({
      banner: 'BANNER',
      matter: { banner: 'BANNER', title: 'Title' },
      minutes: 1,
      title: 'Title',
      text: `
Paragraph one.

Paragraph two.`,
    });
  });

  it('should throw when the banner is invalid', () => {
    // Given
    const text = makeMarkdown(['---', 'banner: 123.4', '---']);
    jest.mocked(readFileSync).mockReturnValueOnce(text);
    // When
    const test = () => read('markdown.md');
    // Then
    expect(test).toThrow('Wrong format for banner "123.4" in "markdown.md"');
  });

  it('should throw when the title is invalid', () => {
    // Given
    const text = makeMarkdown(['---', 'title: [foo, bar]', '---']);
    jest.mocked(readFileSync).mockReturnValueOnce(text);
    // When
    const test = () => read('markdown.md');
    // Then
    expect(test).toThrow('Wrong format for title "foo,bar" in "markdown.md"');
  });
});
