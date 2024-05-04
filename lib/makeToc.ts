import { type PhrasingContent, type Root, type RootContent } from 'mdast';
import { toc } from 'mdast-util-toc';
import { remark } from 'remark';

export type Toc = { items?: Toc[]; title?: string; url?: string };

const flatten = (tokens: PhrasingContent[]): string =>
  tokens.reduce((accumulator, token) => {
    if (token.type !== 'text') {
      throw new Error(`Found unsupported node type in heading "${token}"`);
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
        throw new Error('Missing "first" node in "listItem"');
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

export const makeToc = (content: string): Toc => {
  const { data } = remark()
    .use(() => (node: Root, output) => {
      const { map } = toc(node);
      output.data = map ? parseToc(map) : {};
    })
    .processSync(content);
  return data;
};
