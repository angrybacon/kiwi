import readingTime from 'reading-time';
import { visit } from 'unist-util-visit';

import { type ReadPlugin } from './read';

export const remarkMinutes: ReadPlugin = () => async (tree, file) => {
  let text = '';
  visit(tree, 'text', (node) => void (text += node.value));
  const { minutes } = readingTime(text);
  Object.assign(file.data, { minutes: Number.parseInt(minutes.toFixed(0)) });
};
