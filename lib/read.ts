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
 */
export const read = async (
  target: string | { crumbs: readonly string[]; root: string },
  ...plugins: Plugin[]
): Promise<{
  data: Record<string, unknown>;
  matter: Record<string, unknown>;
  minutes: number;
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
    typeof target === 'string' ? target : join(target.root, ...target.crumbs);
  const buffer = readFileSync(path + '.md');
  const { data, value } = await processor.process(buffer);
  return {
    data,
    matter: data.matter as Record<string, unknown>,
    minutes: data.minutes as number,
    text: String(value),
  };
};
