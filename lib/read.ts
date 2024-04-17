import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

/**
 * Read file at `path` as Markdown and parse the frontmatter found.
 * By default look in the `markdown/` directory where the process is run.
 */
export const read = (
  path: string,
  root: string = 'markdown',
): { matter: Record<string, unknown>; text: string; title?: string } => {
  try {
    const buffer = readFileSync(join(process.cwd(), root, path), 'utf8');
    const { content, data } = matter(buffer);
    const { title } = data;
    if (title && typeof title !== 'string') {
      throw new Error(`Wrong format for title "${title}"`);
    }
    return { matter: data, text: content, title };
  } catch (error) {
    const message = error instanceof Error ? error.message : `${error}`;
    throw new Error(`${message} in "${join(root, path)}"`);
  }
};