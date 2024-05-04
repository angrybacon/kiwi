import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

/**
 * Read file at `path` as Markdown and parse the frontmatter found.
 * By default look in the `markdown/` directory where the process is run.
 */
export const read = (
  path: string,
  root: string = 'markdown',
): {
  banner?: string;
  matter: Record<string, unknown>;
  minutes: string;
  text: string;
  title?: string;
} => {
  try {
    const buffer = readFileSync(join(process.cwd(), root, path), 'utf8');
    const { content, data } = matter(buffer);
    const { banner, title } = data;
    if (banner && typeof banner !== 'string') {
      throw new Error(`Wrong format for banner "${banner}"`);
    }
    if (title && typeof title !== 'string') {
      throw new Error(`Wrong format for title "${title}"`);
    }
    return {
      banner,
      matter: data,
      // TODO Return a fixed number instead of a string
      minutes: readingTime(content).minutes.toFixed(),
      text: content,
      title,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : `${error}`;
    throw new Error(`${message} in "${join(root, path)}"`);
  }
};
