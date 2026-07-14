import type { ReadPlugin } from './read';

import readingTime from 'reading-time';
import { visit } from 'unist-util-visit';

export const remarkMinutes: ReadPlugin = () => (tree, file) => {
  let text = '';
  visit(tree, 'text', (node) => void (text += node.value));
  const { minutes } = readingTime(text);
  Object.assign(file.data, { minutes: Math.round(minutes) });
};
