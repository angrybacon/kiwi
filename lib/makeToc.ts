import { type PhrasingContent, type Root, type RootContent } from 'mdast';
import { toc, type Options } from 'mdast-util-toc';
import { remark } from 'remark';

export type Toc = {
  items?: Toc[];
  title?: string;
  url?: string;
};

/** Pull and join text nodes from the provided TOKENS, recursively */
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

const parseToc = (node: RootContent, accumulator: Toc = {}): Toc => {
  switch (node?.type) {
    case 'list':
      accumulator.items = node.children.map((child) => parseToc(child));
      return accumulator;
    case 'listItem':
      const [first, second] = node.children;
      if (!first) {
        throw new Error('Missing node "first" in "listItem"');
      }
      const heading = parseToc(first, {});
      if (second) {
        parseToc(second, heading);
      }
      return heading;
    case 'paragraph':
      const [link] = node.children;
      if (link?.type !== 'link') {
        throw new Error(`Found unsupported node type in paragraph "${link}"`);
      }
      accumulator.title = flatten(link.children);
      accumulator.url = link.url;
  }
  return accumulator;
};

/**
 * Parse the provided CONTENT Markdown string and spit out a table of content.
 * The structure is recursive in order to allow up the 6 heading levels.
 * The supported OPTIONS come from `mdast-util-toc` and are passed through
 * unaltered.
 */
export const makeToc = (content: string, options?: Options) => {
  const { data } = remark()
    .use(() => (node: Root, output) => {
      const { map } = toc(node, options);
      output.data = map ? parseToc(map) : {};
    })
    .processSync(content);
  return data as Toc;
};
