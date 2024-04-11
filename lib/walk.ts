import { existsSync, readdirSync } from 'fs';
import { join, parse } from 'node:path';

interface WalkOptions {
  depth?: number;
  extension?: string;
}

/**
 * Generator to walk through `directory` and yield all of its files.
 * Return a tuple containing all successive parent folders followed by the file
 * with their extension.
 * When `extension` is specified, only return files that match.
 * Prefer synchronous exploration since order matters.
 */
function* walkIterator(
  directory: string,
  options: WalkOptions = {},
  accumulator: string[] = [],
): Generator<string[], void> {
  const { depth, extension } = options;
  if (accumulator.length === depth) return;
  if (existsSync(directory)) {
    // NOTE Looping over the stream requires the `--downlevelIteration` flag
    for (const file of readdirSync(directory, { withFileTypes: true })) {
      const { ext, name } = parse(file.name);
      if (file.isDirectory()) {
        const entry = join(directory, file.name);
        yield* walkIterator(entry, options, [...accumulator, file.name]);
      } else if (file.isFile() && (!extension || ext === extension)) {
        yield [...accumulator, name];
      }
    }
  }
}

/**
 * Traverse down `directory` and return an array of tuples corresponding to all
 * paths found within.
 * Travel only as far down as `options.depth` and limit results to
 * `options.extension` if provided.
 */
export const walkDirectory = (
  directory: string,
  options?: WalkOptions,
): string[][] => Array.from(walkIterator(directory, options));

/** Walk through the provided `root` and return an array of named routes. */
export const walk = <
  TName extends string,
  TRoute extends Record<TName, string>,
>(
  root: string,
  names: TName[],
): TRoute[] =>
  walkDirectory(root).map((crumbs) => {
    if (crumbs.length !== names.length) {
      throw new Error(
        `Found orphan at "${crumbs}", expected depth of ${names.length}`,
      );
    }
    return names.reduce(
      (route, name, index) => ({ ...route, [name]: crumbs[index] }),
      {} as TRoute,
    );
  });
