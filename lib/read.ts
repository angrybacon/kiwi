import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

type Matter = Record<string, unknown>;

/**
 * Read file at `path` as Markdown and parse the frontmatter found.
 * By default look in the `markdown/` directory where the process is run.
 */
export const read = (
  path: string,
  root: string = 'markdown',
): { matter: Matter; text: string } => {
  try {
    const buffer = readFileSync(join(process.cwd(), root, path), 'utf8');
    const { content, data } = matter(buffer);
    return { matter: data, text: content };
  } catch (error) {
    const message = error instanceof Error ? error.message : `${error}`;
    throw new Error(`${message} in "${join(root, path)}"`);
  }
};
