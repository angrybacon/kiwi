import type { PhrasingContent, Root, RootContent } from 'mdast';
import type { Options } from 'mdast-util-toc';

import { toc } from 'mdast-util-toc';
import { remark } from 'remark';

export type Toc = {
  items?: Toc[];
  title?: string;
  url?: string;
};

/** Pull and join text nodes from the provided TOKENS */
const flatten = (tokens: PhrasingContent[]): string =>
  tokens.reduce((accumulator, token) => {
    if ('children' in token) {
      return accumulator + flatten(token.children);
    }
    if (token.type !== 'text') {
      throw new Error(`Found unsupported node type in heading "${token.type}"`);
    }
    return accumulator + token.value;
  }, '');

const parseToc = (
  node: RootContent | undefined,
  accumulator: Toc = {},
): Toc => {
  if (node === undefined) return accumulator;
  // oxlint-disable-next-line typescript/switch-exhaustiveness-check
  switch (node.type) {
    case 'list': {
      accumulator.items = node.children.map((child) => parseToc(child));
      return accumulator;
    }
    case 'listItem': {
      const [first, second] = node.children;
      if (!first) {
        throw new Error('Missing node "first" in "listItem"');
      }
      const heading = parseToc(first, {});
      if (second) {
        parseToc(second, heading);
      }
      return heading;
    }
    case 'paragraph': {
      const [link] = node.children;
      if (link?.type !== 'link') {
        const it = JSON.stringify(link, null, 2);
        throw new Error(`Found unsupported node type in paragraph ${it}`);
      }
      accumulator.title = flatten(link.children);
      accumulator.url = link.url;
      return accumulator;
    }
    default: {
      return accumulator;
    }
  }
};

/**
 * Parse the provided CONTENT Markdown string and spit out a table of content.
 * The structure is recursive in order to allow up the 6 heading levels.
 * The supported OPTIONS come from `mdast-util-toc` and are passed through
 * unaltered.
 */
export const makeToc = (content: string, options?: Options) => {
  let result: Toc = {};
  remark()
    .use(() => (node: Root) => void (result = parseToc(toc(node, options).map)))
    .processSync(content);
  return result;
};
