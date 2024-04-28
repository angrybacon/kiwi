// @ts-nocheck
import { toc } from 'mdast-util-toc';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';

// NOTE Copied from shadcn/ui for educational purposes, will adjust for my
//      specific needs as soon as Jest is fixed.

const TEXT_TYPES = ['emphasis', 'inlineCode', 'strong', 'text'];

const flattenNode = (node) => {
  const p = [];
  visit(node, (node) => {
    if (!TEXT_TYPES.includes(node.type)) return;
    p.push(node.value);
  });
  return p.join('');
};

export type Item = {
  items?: Item[];
  title: string;
  url: string;
};

type Items = {
  items?: Item[];
};

const getItems = (node, current): Items => {
  if (!node) return {};
  if (node.type === 'paragraph') {
    visit(node, (item) => {
      if (item.type === 'link') {
        current.url = item.url;
        current.title = flattenNode(node);
      }
      if (item.type === 'text') {
        current.title = flattenNode(node);
      }
    });
    return current;
  }
  if (node.type === 'list') {
    current.items = node.children.map((i) => getItems(i, {}));
    return current;
  } else if (node.type === 'listItem') {
    const heading = getItems(node.children[0], {});
    if (node.children.length > 1) {
      getItems(node.children[1], heading);
    }
    return heading;
  }
  return {};
};

const makeToc = () => (node, file) => {
  const table = toc(node);
  const items = getItems(table.map, {});
  file.data = items;
};

export const getToc = (content: string): Items => {
  const { data } = remark().use(makeToc).processSync(content);
  return data;
};
