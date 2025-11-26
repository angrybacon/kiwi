import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import remarkDirective from 'remark-directive';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified, type Plugin } from 'unified';

import { remarkMatter } from './remarkMatter.ts';
import { remarkMinutes } from './remarkMinutes.ts';

/**
 * Read and parse Markdown file found at the path described by TARGET.
 *
 * If TARGET is a string, use it directly. Otherwise, join CRUMBS under ROOT and
 * append the file extension automatically.
 *
 * Chain Remark PLUGINS in serie after all the base plugins have been applied.
 */
export const read = async (
  target: string | { crumbs: readonly string[]; root: string },
  ...plugins: Plugin[]
): Promise<{
  /** Dictionary containing the plugins output */
  data: Record<string, unknown>;
  /** Dictionary of matter data found in the Markdown */
  matter: Record<string, unknown>;
  /** Estimated reading time of the whole document */
  minutes: number;
  /** Full path of the target */
  path: string;
  /** Markdown-formatted string found in the document */
  text: string;
}> => {
  let processor = unified()
    .use(remarkDirective)
    .use(remarkFrontmatter)
    .use(remarkMatter)
    .use(remarkMinutes)
    .use(remarkParse)
    .use(remarkStringify);
  processor = plugins.reduce<typeof processor>(
    (accumulator, plugin) => accumulator.use(plugin),
    processor,
  );
  const path =
    typeof target === 'string'
      ? target
      : join(target.root, ...target.crumbs) + '.md';
  const buffer = readFileSync(path);
  const {
    data: { matter, minutes, ...data },
    value,
  } = await processor.process(buffer);
  return {
    data,
    matter: matter as Record<string, unknown>,
    minutes: minutes as number,
    path,
    text: String(value),
  };
};
