import { existsSync, readdirSync } from 'fs';
import { join, parse } from 'node:path';

/**
 * Generator to walk through `directory` and yield all of its files.
 * Return a tuple containing all successive parent folders followed by the file
 * with their extension.
 * When `extension` is specified, only return files that match.
 * Prefer synchronous exploration since order matters.
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
 * Traverse down `directory` and return an array of tuples corresponding to all
 * paths found within.
 * Travel only as far down as `options.depth` and limit results to
 * `options.extension` if provided.
 */
export const walkDirectory = (
  directory: string,
  extension?: string,
): string[][] => Array.from(walkIterator(directory, extension));

/** Walk through the provided `root` and return an array of named routes. */
export const walk = <
  TName extends string,
  TRoute extends Record<TName, { pretty: string; raw: string }>,
>(
  root: string,
  names: TName[],
  options: { extension?: string } = {},
): TRoute[] => {
  const { extension } = options;
  return walkDirectory(root, extension).map((crumbs) => {
    if (crumbs.length !== names.length) {
      throw new Error(
        `Found orphan at "${crumbs}", expected depth of ${names.length}`,
      );
    }
    return names.reduce(
      (route, name, index) => ({
        ...route,
        [name]: {
          pretty: crumbs[index]!.replace(/^\d+-/, ''),
          raw: crumbs[index]!,
        },
      }),
      {} as TRoute,
    );
  });
};
