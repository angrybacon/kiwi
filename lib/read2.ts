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
 * Read file found at the path described by the `crumbs` as Markdown and parse
 * its content.
 * This assumes the file extension is provided with the last crumb.
 * This assumes the path crumbs are relative to the process working directory.
 */
export const read2 = async (
  crumbs: string[],
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
  const buffer = readFileSync(join(...crumbs));
  const { data, value } = await processor.process(buffer);
  return {
    data,
    matter: data.matter as Record<string, unknown>,
    minutes: data.minutes as number,
    text: String(value),
  };
};
