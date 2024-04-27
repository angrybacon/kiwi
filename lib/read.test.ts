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
    read('markdown.md');
    // Then
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/\/markdown.md$/),
      'utf8',
    );
  });

  it('should read the file under the provided root', () => {
    // Given
    jest.mocked(readFileSync).mockReturnValueOnce('');
    // When
    read('markdown.md', 'root');
    // Then
    expect(readFileSync).toHaveBeenCalledTimes(1);
    expect(readFileSync).toHaveBeenCalledWith(
      expect.stringMatching(/\/root\/markdown.md$/),
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
      minutes: expect.any(Number),
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
      minutes: expect.any(Number),
      title: 'Title',
      text: `
Paragraph one.

Paragraph two.`,
    });
  });
});
