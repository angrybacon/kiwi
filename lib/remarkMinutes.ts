import type { Root } from 'mdast';
import readingTime from 'reading-time';
import { type Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const remarkMinutes: Plugin<[], Root> = () => async (tree, file) => {
  let text = '';
  visit(tree, 'text', (node) => void (text += node.value));
  const { minutes } = readingTime(text);
  Object.assign(file.data, { minutes: minutes.toFixed(0) });
};
