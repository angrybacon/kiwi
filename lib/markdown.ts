import { readFileSync } from 'fs';
import matter from 'gray-matter';

type Matter = Record<string, unknown>;

/** Read file at `path` as Markdown and parse the frontmatter found. */
export const read = (path: string): { matter: Matter; text: string } => {
  const buffer: string = readFileSync(path, 'utf8');
  const { content, data } = matter(buffer);
  return { matter: data, text: content };
};
