import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

/**
 * Read file found at the path described by the `crumbs` as Markdown and parse
 * the frontmatter found.
 * This assumes the file extension is provided with the last crumb.
 * This assumes the path crumbs are relative to the process working directory.
 *
 * @deprecated Use `read2` instead
 */
export const read = (
  ...crumbs: string[]
): {
  banner?: string;
  matter: Record<string, unknown>;
  minutes: number;
  text: string;
  title?: string;
} => {
  const path = join(...crumbs);
  const buffer = readFileSync(path, 'utf8');
  try {
    const { content, data } = matter(buffer);
    const { banner, title } = data;
    assertStringTypes({ banner, title });
    return {
      banner,
      matter: data,
      minutes: Math.ceil(readingTime(content).minutes),
      text: content,
      title,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : `${error}`;
    throw new Error(`${message} in "${path}"`);
  }
};

function assertStringTypes(
  values: Record<string, unknown>,
): asserts values is Record<string, string> {
  Object.entries(values).forEach(([name, value]) => {
    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`Wrong format for ${name} "${value}"`);
    }
  });
}
