import { existsSync, readdirSync } from 'fs';
import { join, parse } from 'node:path';

/**
 * Generator to walk through DIRECTORY and yield all of its files.
 *
 * Return a tuple containing all successive parent folders followed by the file
 * with their extension.
 *
 * When EXTENSION is specified, only return files that match.
 * Prefer synchronous exploration since order matters.
 *
 * The ACCUMULATOR functions the same as in a standard `Array.reduce` method.
 */
function* walkIterator(
  directory: string,
  extension?: string,
  accumulator: string[] = [],
): Generator<string[], void> {
  if (existsSync(directory)) {
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const { ext, name } = parse(file.name);
      if (file.isDirectory()) {
        const entry = join(directory, file.name);
        yield* walkIterator(entry, extension, [...accumulator, file.name]);
      } else if (file.isFile() && (!extension || ext === extension)) {
        yield [...accumulator, name];
      }
    }
  }
}

/**
 * Traverse down DIRECTORY and return an array of path tuples.
 * Sort the output and limit results to EXTENSION if provided.
 */
export const walk = (
  directory: string,
  options: { extension?: string } = {},
): string[][] => {
  const paths = Array.from(walkIterator(directory, options.extension));
  return paths.sort((a, b) => a.join().localeCompare(b.join()));
};
